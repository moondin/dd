---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:25Z
part: 22
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 22 of 552)

````text
================================================================================
FULLSTACK USER CREATED CODE DATABASE (VERBATIM) - vscode-main
================================================================================
Generated: December 18, 2025
Source: user_created_projects/vscode-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: cli/src/commands/tunnels.rs]---
Location: vscode-main/cli/src/commands/tunnels.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use async_trait::async_trait;
use base64::{engine::general_purpose as b64, Engine as _};
use futures::{stream::FuturesUnordered, StreamExt};
use serde::Serialize;
use sha2::{Digest, Sha256};
use std::{
	net::{IpAddr, Ipv4Addr, SocketAddr},
	str::FromStr,
	time::Duration,
};
use sysinfo::Pid;
use tokio::{
	io::{AsyncBufReadExt, BufReader},
	sync::watch,
};

use super::{
	args::{
		AuthProvider, CliCore, CommandShellArgs, ExistingTunnelArgs, TunnelArgs, TunnelForwardArgs,
		TunnelRenameArgs, TunnelServeArgs, TunnelServiceSubCommands, TunnelUserSubCommands,
	},
	CommandContext,
};

use crate::{
	async_pipe::{get_socket_name, listen_socket_rw_stream, AsyncRWAccepter},
	auth::Auth,
	constants::{
		APPLICATION_NAME, CONTROL_PORT, IS_A_TTY, TUNNEL_CLI_LOCK_NAME, TUNNEL_SERVICE_LOCK_NAME,
	},
	log,
	state::LauncherPaths,
	tunnels::{
		code_server::CodeServerArgs,
		create_service_manager,
		dev_tunnels::{self, DevTunnels},
		legal, local_forwarding,
		paths::get_all_servers,
		protocol, serve_stream,
		shutdown_signal::ShutdownRequest,
		singleton_client::do_single_rpc_call,
		singleton_server::{
			make_singleton_server, start_singleton_server, BroadcastLogSink, SingletonServerArgs,
		},
		AuthRequired, Next, ServeStreamParams, ServiceContainer, ServiceManager,
	},
	util::{
		app_lock::AppMutex,
		command::new_std_command,
		errors::{wrap, AnyError, CodeError},
		machine::canonical_exe,
		prereqs::PreReqChecker,
	},
};
use crate::{
	singleton::{acquire_singleton, SingletonConnection},
	tunnels::{
		dev_tunnels::ActiveTunnel,
		singleton_client::{start_singleton_client, SingletonClientArgs},
		SleepInhibitor,
	},
};

impl From<AuthProvider> for crate::auth::AuthProvider {
	fn from(auth_provider: AuthProvider) -> Self {
		match auth_provider {
			AuthProvider::Github => crate::auth::AuthProvider::Github,
			AuthProvider::Microsoft => crate::auth::AuthProvider::Microsoft,
		}
	}
}

fn fulfill_existing_tunnel_args(
	d: ExistingTunnelArgs,
	name_arg: &Option<String>,
) -> Option<dev_tunnels::ExistingTunnel> {
	let tunnel_name = d.tunnel_name.or_else(|| name_arg.clone());

	match (d.tunnel_id, d.cluster, d.host_token) {
		(Some(tunnel_id), None, Some(host_token)) => {
			let i = tunnel_id.find('.')?;
			Some(dev_tunnels::ExistingTunnel {
				tunnel_id: tunnel_id[..i].to_string(),
				cluster: tunnel_id[i + 1..].to_string(),
				tunnel_name,
				host_token,
			})
		}

		(Some(tunnel_id), Some(cluster), Some(host_token)) => Some(dev_tunnels::ExistingTunnel {
			tunnel_id,
			tunnel_name,
			host_token,
			cluster,
		}),

		_ => None,
	}
}

struct TunnelServiceContainer {
	core_args: CliCore,
	tunnel_args: TunnelArgs,
}

impl TunnelServiceContainer {
	fn new(core_args: CliCore, tunnel_args: TunnelArgs) -> Self {
		Self {
			core_args,
			tunnel_args,
		}
	}
}

#[async_trait]
impl ServiceContainer for TunnelServiceContainer {
	async fn run_service(
		&mut self,
		log: log::Logger,
		launcher_paths: LauncherPaths,
	) -> Result<(), AnyError> {
		let mut csa = (&self.core_args).into();
		self.tunnel_args.serve_args.server_args.apply_to(&mut csa);
		serve_with_csa(
			launcher_paths,
			log,
			TunnelServeArgs {
				random_name: true, // avoid prompting
				..Default::default()
			},
			csa,
			TUNNEL_SERVICE_LOCK_NAME,
		)
		.await?;
		Ok(())
	}
}

pub async fn command_shell(ctx: CommandContext, args: CommandShellArgs) -> Result<i32, AnyError> {
	let platform = PreReqChecker::new().verify().await?;
	let mut shutdown_reqs = vec![ShutdownRequest::CtrlC];
	if let Some(p) = args.parent_process_id.and_then(|p| Pid::from_str(&p).ok()) {
		shutdown_reqs.push(ShutdownRequest::ParentProcessKilled(p));
	}

	let mut params = ServeStreamParams {
		log: ctx.log,
		launcher_paths: ctx.paths,
		platform,
		requires_auth: args
			.require_token
			.map(AuthRequired::VSDAWithToken)
			.unwrap_or(AuthRequired::VSDA),
		exit_barrier: ShutdownRequest::create_rx(shutdown_reqs),
		code_server_args: (&ctx.args).into(),
	};

	args.server_args.apply_to(&mut params.code_server_args);

	let mut listener: Box<dyn AsyncRWAccepter> =
		match (args.on_port.first(), &args.on_host, args.on_socket) {
			(_, _, true) => {
				let socket = get_socket_name();
				let listener = listen_socket_rw_stream(&socket)
					.await
					.map_err(|e| wrap(e, "error listening on socket"))?;

				params
					.log
					.result(format!("Listening on {}", socket.display()));

				Box::new(listener)
			}
			(Some(_), _, _) | (_, Some(_), _) => {
				let host = args
					.on_host
					.as_ref()
					.map(|h| h.parse().map_err(CodeError::InvalidHostAddress))
					.unwrap_or(Ok(IpAddr::V4(Ipv4Addr::LOCALHOST)))?;

				let lower_port = args.on_port.first().copied().unwrap_or_default();
				let port_no = if let Some(upper) = args.on_port.get(1) {
					find_unused_port(&host, lower_port, *upper)
						.await
						.unwrap_or_default()
				} else {
					lower_port
				};

				let addr = SocketAddr::new(host, port_no);
				let listener = tokio::net::TcpListener::bind(addr)
					.await
					.map_err(|e| wrap(e, "error listening on port"))?;

				params
					.log
					.result(format!("Listening on {}", listener.local_addr().unwrap()));

				Box::new(listener)
			}
			_ => {
				serve_stream(tokio::io::stdin(), tokio::io::stderr(), params).await;
				return Ok(0);
			}
		};

	let mut servers = FuturesUnordered::new();

	loop {
		tokio::select! {
			Some(_) = servers.next() => {},
			socket = listener.accept_rw() => {
				match socket {
					Ok((read, write)) => servers.push(serve_stream(read, write, params.clone())),
					Err(e) => {
						error!(params.log, &format!("Error accepting connection: {e}"));
						return Ok(1);
					}
				}
			},
			_ = params.exit_barrier.wait() => {
				// wait for all servers to finish up:
				while (servers.next().await).is_some() { }
				return Ok(0);
			}
		}
	}
}

async fn find_unused_port(host: &IpAddr, start_port: u16, end_port: u16) -> Option<u16> {
	for port in start_port..=end_port {
		if is_port_available(*host, port).await {
			return Some(port);
		}
	}
	None
}

async fn is_port_available(host: IpAddr, port: u16) -> bool {
	tokio::net::TcpListener::bind(SocketAddr::new(host, port))
		.await
		.is_ok()
}

fn make_service_args<'a: 'c, 'b: 'c, 'c>(
	root_path: &'a str,
	tunnel_args: &'b TunnelArgs,
) -> Vec<&'c str> {
	let mut args = ["--verbose", "--cli-data-dir", root_path, "tunnel"].to_vec();

	if let Some(d) = tunnel_args.serve_args.server_args.extensions_dir.as_ref() {
		args.extend_from_slice(&["--extensions-dir", d]);
	}
	if let Some(d) = tunnel_args.serve_args.server_args.server_data_dir.as_ref() {
		args.extend_from_slice(&["--server-data-dir", d]);
	}

	args.extend_from_slice(&["service", "internal-run"]);

	args
}

pub async fn service(
	ctx: CommandContext,
	tunnel_args: TunnelArgs,
	service_args: TunnelServiceSubCommands,
) -> Result<i32, AnyError> {
	let manager = create_service_manager(ctx.log.clone(), &ctx.paths);
	match service_args {
		TunnelServiceSubCommands::Install(args) => {
			let auth = Auth::new(&ctx.paths, ctx.log.clone());

			if let Some(name) = &args.name {
				// ensure the name matches, and tunnel exists
				dev_tunnels::DevTunnels::new_remote_tunnel(&ctx.log, auth, &ctx.paths)
					.rename_tunnel(name)
					.await?;
			} else {
				// still ensure they're logged in, otherwise subsequent serving will fail
				auth.get_credential().await?;
			}

			// likewise for license consent
			legal::require_consent(&ctx.paths, args.accept_server_license_terms)?;

			let current_exe = canonical_exe().map_err(|e| wrap(e, "could not get current exe"))?;
			let root_path = ctx.paths.root().as_os_str().to_string_lossy();
			let args = make_service_args(&root_path, &tunnel_args);

			manager.register(current_exe, &args).await?;
			ctx.log.result(format!("Service successfully installed! You can use `{APPLICATION_NAME} tunnel service log` to monitor it, and `{APPLICATION_NAME} tunnel service uninstall` to remove it."));
		}
		TunnelServiceSubCommands::Uninstall => {
			manager.unregister().await?;
		}
		TunnelServiceSubCommands::Log => {
			manager.show_logs().await?;
		}
		TunnelServiceSubCommands::InternalRun => {
			manager
				.run(
					ctx.paths.clone(),
					TunnelServiceContainer::new(ctx.args, tunnel_args),
				)
				.await?;
		}
	}

	Ok(0)
}

pub async fn user(ctx: CommandContext, user_args: TunnelUserSubCommands) -> Result<i32, AnyError> {
	let auth = Auth::new(&ctx.paths, ctx.log.clone());
	match user_args {
		TunnelUserSubCommands::Login(mut login_args) => {
			auth.login(
				login_args.provider.map(|p| p.into()),
				login_args.access_token.take(),
				login_args.refresh_token.take(),
			)
			.await?;
		}
		TunnelUserSubCommands::Logout => {
			auth.clear_credentials()?;
		}
		TunnelUserSubCommands::Show => {
			if let Ok(Some(sc)) = auth.get_current_credential() {
				ctx.log.result(format!("logged in with provider {}", sc.provider));
			} else {
				ctx.log.result("not logged in");
				return Ok(1);
			}
		}
	}

	Ok(0)
}

/// Remove the tunnel used by this tunnel, if any.
pub async fn rename(ctx: CommandContext, rename_args: TunnelRenameArgs) -> Result<i32, AnyError> {
	let auth = Auth::new(&ctx.paths, ctx.log.clone());
	let mut dt = dev_tunnels::DevTunnels::new_remote_tunnel(&ctx.log, auth, &ctx.paths);
	dt.rename_tunnel(&rename_args.name).await?;
	ctx.log.result(format!(
		"Successfully renamed this tunnel to {}",
		&rename_args.name
	));

	Ok(0)
}

/// Remove the tunnel used by this tunnel, if any.
pub async fn unregister(ctx: CommandContext) -> Result<i32, AnyError> {
	let auth = Auth::new(&ctx.paths, ctx.log.clone());
	let mut dt = dev_tunnels::DevTunnels::new_remote_tunnel(&ctx.log, auth, &ctx.paths);
	dt.remove_tunnel().await?;
	Ok(0)
}

pub async fn restart(ctx: CommandContext) -> Result<i32, AnyError> {
	do_single_rpc_call::<_, ()>(
		&ctx.paths.tunnel_lockfile(),
		ctx.log,
		protocol::singleton::METHOD_RESTART,
		protocol::EmptyObject {},
	)
	.await
	.map(|_| 0)
	.map_err(|e| e.into())
}

pub async fn kill(ctx: CommandContext) -> Result<i32, AnyError> {
	do_single_rpc_call::<_, ()>(
		&ctx.paths.tunnel_lockfile(),
		ctx.log,
		protocol::singleton::METHOD_SHUTDOWN,
		protocol::EmptyObject {},
	)
	.await
	.map(|_| 0)
	.map_err(|e| e.into())
}

#[derive(Serialize)]
pub struct StatusOutput {
	pub tunnel: Option<protocol::singleton::StatusWithTunnelName>,
	pub service_installed: bool,
}

pub async fn status(ctx: CommandContext) -> Result<i32, AnyError> {
	let tunnel = do_single_rpc_call::<_, protocol::singleton::StatusWithTunnelName>(
		&ctx.paths.tunnel_lockfile(),
		ctx.log.clone(),
		protocol::singleton::METHOD_STATUS,
		protocol::EmptyObject {},
	)
	.await;

	let service_installed = create_service_manager(ctx.log.clone(), &ctx.paths)
		.is_installed()
		.await
		.unwrap_or(false);

	ctx.log.result(
		serde_json::to_string(&StatusOutput {
			service_installed,
			tunnel: match tunnel {
				Ok(s) => Some(s),
				Err(CodeError::NoRunningTunnel | CodeError::AsyncPipeFailed(_)) => None,
				Err(e) => return Err(e.into()),
			},
		})
		.unwrap(),
	);

	Ok(0)
}

/// Removes unused servers.
pub async fn prune(ctx: CommandContext) -> Result<i32, AnyError> {
	get_all_servers(&ctx.paths)
		.into_iter()
		.map(|s| s.server_paths(&ctx.paths))
		.filter(|s| s.get_running_pid().is_none())
		.try_for_each(|s| {
			ctx.log
				.result(format!("Deleted {}", s.server_dir.display()));
			s.delete()
		})
		.map_err(AnyError::from)?;

	ctx.log.result("Successfully removed all unused servers");

	Ok(0)
}

/// Starts the gateway server.
pub async fn serve(ctx: CommandContext, gateway_args: TunnelServeArgs) -> Result<i32, AnyError> {
	let CommandContext {
		log, paths, args, ..
	} = ctx;

	let no_sleep = match gateway_args.no_sleep.then(SleepInhibitor::new) {
		Some(i) => match i.await {
			Ok(i) => Some(i),
			Err(e) => {
				warning!(log, "Could not inhibit sleep: {}", e);
				None
			}
		},
		None => None,
	};

	legal::require_consent(&paths, gateway_args.accept_server_license_terms)?;

	let mut csa = (&args).into();
	gateway_args.server_args.apply_to(&mut csa);
	let result = serve_with_csa(paths, log, gateway_args, csa, TUNNEL_CLI_LOCK_NAME).await;
	drop(no_sleep);

	result
}

/// Internal command used by port forwarding. It reads requests for forwarded ports
/// on lines from stdin, as JSON. It uses singleton logic as well (though on
/// a different tunnel than the main one used for the control server) so that
/// all forward requests on a single machine go through a single hosted tunnel
/// process. Without singleton logic, requests could get routed to processes
/// that aren't forwarding a given port and then fail.
pub async fn forward(
	ctx: CommandContext,
	mut forward_args: TunnelForwardArgs,
) -> Result<i32, AnyError> {
	// Spooky: check IS_A_TTY before starting the stdin reader, since IS_A_TTY will
	// access stdin but a lock will later be held on stdin by the line-reader.
	if *IS_A_TTY {
		trace!(ctx.log, "port forwarding is an internal preview feature");
	}

	// #region stdin reading logic:
	let (own_ports_tx, own_ports_rx) = watch::channel(vec![]);
	let ports_process_log = ctx.log.clone();
	tokio::spawn(async move {
		let mut lines = BufReader::new(tokio::io::stdin()).lines();
		while let Ok(Some(line)) = lines.next_line().await {
			match serde_json::from_str(&line) {
				Ok(p) => {
					let _ = own_ports_tx.send(p);
				}
				Err(e) => warning!(ports_process_log, "error parsing ports: {}", e),
			}
		}
	});

	// #region singleton acquisition
	let shutdown = ShutdownRequest::create_rx([ShutdownRequest::CtrlC]);
	let server = loop {
		if shutdown.is_open() {
			return Ok(0);
		}

		match acquire_singleton(&ctx.paths.forwarding_lockfile()).await {
			Ok(SingletonConnection::Client(stream)) => {
				debug!(ctx.log, "starting as client to singleton");
				let r = local_forwarding::client(local_forwarding::SingletonClientArgs {
					log: ctx.log.clone(),
					shutdown: shutdown.clone(),
					stream,
					port_requests: own_ports_rx.clone(),
				})
				.await;
				if let Err(e) = r {
					warning!(ctx.log, "error contacting forwarding singleton: {}", e);
				}
			}
			Ok(SingletonConnection::Singleton(server)) => break server,
			Err(e) => {
				warning!(ctx.log, "error access singleton, retrying: {}", e);
				tokio::time::sleep(Duration::from_secs(2)).await
			}
		}
	};

	// #region singleton handler
	let auth = Auth::new(&ctx.paths, ctx.log.clone());
	if let (Some(p), Some(at)) = (
		forward_args.login.provider.take(),
		forward_args.login.access_token.take(),
	) {
		auth.login(
			Some(p.into()),
			Some(at),
			forward_args.login.refresh_token.take(),
		)
		.await?;
	}

	let mut tunnels = DevTunnels::new_port_forwarding(&ctx.log, auth, &ctx.paths);
	let tunnel = tunnels
		.start_new_launcher_tunnel(None, true, &forward_args.ports)
		.await?;

	local_forwarding::server(ctx.log, tunnel, server, own_ports_rx, shutdown).await?;

	Ok(0)
}

fn get_connection_token(tunnel: &ActiveTunnel) -> String {
	let mut hash = Sha256::new();
	hash.update(tunnel.id.as_bytes());
	let result = hash.finalize();
	let mut result = b64::URL_SAFE_NO_PAD.encode(result);
	if result.starts_with('-') {
		result.insert(0, 'a'); // avoid arg parsing issue
	}

	result
}

async fn serve_with_csa(
	paths: LauncherPaths,
	mut log: log::Logger,
	gateway_args: TunnelServeArgs,
	mut csa: CodeServerArgs,
	app_mutex_name: Option<&'static str>,
) -> Result<i32, AnyError> {
	let log_broadcast = BroadcastLogSink::new();
	log = log.tee(log_broadcast.clone());
	log::install_global_logger(log.clone()); // re-install so that library logs are captured

	debug!(
		log,
		"Starting tunnel with `{} {}`",
		APPLICATION_NAME,
		std::env::args().collect::<Vec<_>>().join(" ")
	);

	// Intentionally read before starting the server. If the server updated and
	// respawn is requested, the old binary will get renamed, and then
	// current_exe will point to the wrong path.
	let current_exe = std::env::current_exe().unwrap();

	let mut vec = vec![
		ShutdownRequest::CtrlC,
		ShutdownRequest::ExeUninstalled(current_exe.to_owned()),
	];
	if let Some(p) = gateway_args
		.parent_process_id
		.and_then(|p| Pid::from_str(&p).ok())
	{
		vec.push(ShutdownRequest::ParentProcessKilled(p));
	}
	let mut shutdown = ShutdownRequest::create_rx(vec);

	let server = loop {
		if shutdown.is_open() {
			return Ok(0);
		}

		match acquire_singleton(&paths.tunnel_lockfile()).await {
			Ok(SingletonConnection::Client(stream)) => {
				debug!(log, "starting as client to singleton");
				if gateway_args.name.is_some()
					|| !gateway_args.server_args.install_extension.is_empty()
					|| gateway_args.tunnel.tunnel_id.is_some()
				{
					warning!(
						log,
						"Command-line options will not be applied until the existing tunnel exits."
					);
				}

				let should_exit = start_singleton_client(SingletonClientArgs {
					log: log.clone(),
					shutdown: shutdown.clone(),
					stream,
				})
				.await;
				if should_exit {
					return Ok(0);
				}
			}
			Ok(SingletonConnection::Singleton(server)) => break server,
			Err(e) => {
				warning!(log, "error access singleton, retrying: {}", e);
				tokio::time::sleep(Duration::from_secs(2)).await
			}
		}
	};

	debug!(log, "starting as new singleton");

	let mut server =
		make_singleton_server(log_broadcast.clone(), log.clone(), server, shutdown.clone());
	let platform = spanf!(log, log.span("prereq"), PreReqChecker::new().verify())?;
	let _lock = app_mutex_name.map(AppMutex::new);

	let auth = Auth::new(&paths, log.clone());
	let mut dt = dev_tunnels::DevTunnels::new_remote_tunnel(&log, auth, &paths);
	loop {
		let tunnel = if let Some(t) =
			fulfill_existing_tunnel_args(gateway_args.tunnel.clone(), &gateway_args.name)
		{
			dt.start_existing_tunnel(t).await
		} else {
			tokio::select! {
				t = dt.start_new_launcher_tunnel(gateway_args.name.as_deref(), gateway_args.random_name, &[CONTROL_PORT]) => t,
				_ = shutdown.wait() => return Ok(1),
			}
		}?;

		csa.connection_token = Some(get_connection_token(&tunnel));

		let mut r = start_singleton_server(SingletonServerArgs {
			log: log.clone(),
			tunnel,
			paths: &paths,
			code_server_args: &csa,
			platform,
			log_broadcast: &log_broadcast,
			shutdown: shutdown.clone(),
			server: &mut server,
		})
		.await?;
		r.tunnel.close().await.ok();

		match r.next {
			Next::Respawn => {
				warning!(log, "respawn requested, starting new server");
				// reuse current args, but specify no-forward since tunnels will
				// already be running in this process, and we cannot do a login
				let args = std::env::args().skip(1).collect::<Vec<String>>();
				let exit = new_std_command(current_exe)
					.args(args)
					.spawn()
					.map_err(|e| wrap(e, "error respawning after update"))?
					.wait()
					.map_err(|e| wrap(e, "error waiting for child"))?;

				return Ok(exit.code().unwrap_or(1));
			}
			Next::Exit => {
				debug!(log, "Tunnel shut down");
				return Ok(0);
			}
			Next::Restart => continue,
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/commands/update.rs]---
Location: vscode-main/cli/src/commands/update.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use std::sync::Arc;

use indicatif::ProgressBar;

use crate::{
	constants::PRODUCT_NAME_LONG,
	self_update::SelfUpdate,
	update_service::UpdateService,
	util::{errors::AnyError, http::ReqwestSimpleHttp, input::ProgressBarReporter},
};

use super::{args::StandaloneUpdateArgs, CommandContext};

pub async fn update(ctx: CommandContext, args: StandaloneUpdateArgs) -> Result<i32, AnyError> {
	let update_service = UpdateService::new(
		ctx.log.clone(),
		Arc::new(ReqwestSimpleHttp::with_client(ctx.http.clone())),
	);
	let update_service = SelfUpdate::new(&update_service)?;

	let _ = update_service.cleanup_old_update();

	let current_version = update_service.get_current_release().await?;
	if update_service.is_up_to_date_with(&current_version) {
		ctx.log.result(format!(
			"{} is already to to date ({})",
			PRODUCT_NAME_LONG, current_version.commit
		));
		return Ok(1);
	}

	if args.check {
		ctx.log
			.result(format!("Update to {current_version} is available"));
		return Ok(0);
	}

	let pb = ProgressBar::new(1);
	pb.set_message("Downloading...");
	update_service
		.do_update(&current_version, ProgressBarReporter::from(pb))
		.await?;
	ctx.log
		.result(format!("Successfully updated to {current_version}"));

	Ok(0)
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/commands/version.rs]---
Location: vscode-main/cli/src/commands/version.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use std::path::{Path, PathBuf};

use crate::{
	desktop::{prompt_to_install, CodeVersionManager, RequestedVersion},
	log,
	util::{
		errors::{AnyError, NoInstallInUserProvidedPath},
		prereqs::PreReqChecker,
	},
};

use super::{args::UseVersionArgs, CommandContext};

pub async fn switch_to(ctx: CommandContext, args: UseVersionArgs) -> Result<i32, AnyError> {
	let platform = PreReqChecker::new().verify().await?;
	let vm = CodeVersionManager::new(ctx.log.clone(), &ctx.paths, platform);
	let version = RequestedVersion::try_from(args.name.as_str())?;

	let maybe_path = match args.install_dir {
		Some(d) => Some(
			CodeVersionManager::get_entrypoint_for_install_dir(&PathBuf::from(&d))
				.await
				.ok_or(NoInstallInUserProvidedPath(d))?,
		),
		None => vm.try_get_entrypoint(&version).await,
	};

	match maybe_path {
		Some(p) => {
			vm.set_preferred_version(version.clone(), p.clone()).await?;
			print_now_using(&ctx.log, &version, &p);
			Ok(0)
		}
		None => {
			prompt_to_install(&version);
			Ok(1)
		}
	}
}

pub async fn show(ctx: CommandContext) -> Result<i32, AnyError> {
	let platform = PreReqChecker::new().verify().await?;
	let vm = CodeVersionManager::new(ctx.log.clone(), &ctx.paths, platform);

	let version = vm.get_preferred_version();
	println!("Current quality: {version}");
	match vm.try_get_entrypoint(&version).await {
		Some(p) => println!("Installation path: {}", p.display()),
		None => println!("No existing installation found"),
	}

	Ok(0)
}

fn print_now_using(log: &log::Logger, version: &RequestedVersion, path: &Path) {
	log.result(format!("Now using {} from {}", version, path.display()));
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/desktop/version_manager.rs]---
Location: vscode-main/cli/src/desktop/version_manager.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use std::{
	ffi::OsString,
	fmt, io,
	path::{Path, PathBuf},
};

use lazy_static::lazy_static;
use regex::Regex;
use serde::{Deserialize, Serialize};

use crate::{
	constants::{PRODUCT_DOWNLOAD_URL, QUALITY, QUALITYLESS_PRODUCT_NAME},
	log,
	state::{LauncherPaths, PersistedState},
	update_service::Platform,
	util::{
		command::new_std_command,
		errors::{AnyError, InvalidRequestedVersion},
	},
};

/// Parsed instance that a user can request.
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(tag = "t", content = "c")]
pub enum RequestedVersion {
	Default,
	Commit(String),
	Path(String),
}

lazy_static! {
	static ref COMMIT_RE: Regex = Regex::new(r"(?i)^[0-9a-f]{40}$").unwrap();
}

impl RequestedVersion {
	pub fn get_command(&self) -> String {
		match self {
			RequestedVersion::Default => {
				format!("code version use {QUALITY}")
			}
			RequestedVersion::Commit(commit) => {
				format!("code version use {QUALITY}/{commit}")
			}
			RequestedVersion::Path(path) => {
				format!("code version use {path}")
			}
		}
	}
}

impl std::fmt::Display for RequestedVersion {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		match self {
			RequestedVersion::Default => {
				write!(f, "{QUALITY}")
			}
			RequestedVersion::Commit(commit) => {
				write!(f, "{QUALITY}/{commit}")
			}
			RequestedVersion::Path(path) => write!(f, "{path}"),
		}
	}
}

impl TryFrom<&str> for RequestedVersion {
	type Error = InvalidRequestedVersion;

	fn try_from(s: &str) -> Result<Self, Self::Error> {
		if s == QUALITY {
			return Ok(RequestedVersion::Default);
		}

		if Path::is_absolute(&PathBuf::from(s)) {
			return Ok(RequestedVersion::Path(s.to_string()));
		}

		if COMMIT_RE.is_match(s) {
			return Ok(RequestedVersion::Commit(s.to_string()));
		}

		Err(InvalidRequestedVersion())
	}
}

#[derive(Serialize, Deserialize, Clone, Default)]
struct Stored {
	/// Map of requested versions to locations where those versions are installed.
	versions: Vec<(RequestedVersion, OsString)>,
	current: usize,
}

pub struct CodeVersionManager {
	state: PersistedState<Stored>,
	log: log::Logger,
}

impl CodeVersionManager {
	pub fn new(log: log::Logger, lp: &LauncherPaths, _platform: Platform) -> Self {
		CodeVersionManager {
			log,
			state: PersistedState::new(lp.root().join("versions.json")),
		}
	}

	/// Tries to find the binary entrypoint for VS Code installed in the path.
	pub async fn get_entrypoint_for_install_dir(path: &Path) -> Option<PathBuf> {
		use tokio::sync::mpsc;

		// Check whether the user is supplying a path to the CLI directly (e.g. #164622)
		if let Ok(true) = path.metadata().map(|m| m.is_file()) {
			let result = new_std_command(path)
				.args(["--version"])
				.output()
				.map(|o| o.status.success());

			if let Ok(true) = result {
				return Some(path.to_owned());
			}
		}

		let (tx, mut rx) = mpsc::channel(1);

		// Look for all the possible paths in parallel
		for entry in DESKTOP_CLI_RELATIVE_PATH.split(',') {
			let my_path = path.join(entry);
			let my_tx = tx.clone();
			tokio::spawn(async move {
				if tokio::fs::metadata(&my_path).await.is_ok() {
					my_tx.send(my_path).await.ok();
				}
			});
		}

		drop(tx); // drop so rx gets None if no sender emits

		rx.recv().await
	}

	/// Sets the "version" as the persisted one for the user.
	pub async fn set_preferred_version(
		&self,
		version: RequestedVersion,
		path: PathBuf,
	) -> Result<(), AnyError> {
		let mut stored = self.state.load();
		stored.current = self.store_version_path(&mut stored, version, path);
		self.state.save(stored)?;
		Ok(())
	}

	/// Stores or updates the path used for the given version. Returns the index
	/// that the path exists at.
	fn store_version_path(
		&self,
		state: &mut Stored,
		version: RequestedVersion,
		path: PathBuf,
	) -> usize {
		if let Some(i) = state.versions.iter().position(|(v, _)| v == &version) {
			state.versions[i].1 = path.into_os_string();
			i
		} else {
			state
				.versions
				.push((version.clone(), path.into_os_string()));
			state.versions.len() - 1
		}
	}

	/// Gets the currently preferred version based on set_preferred_version.
	pub fn get_preferred_version(&self) -> RequestedVersion {
		let stored = self.state.load();
		stored
			.versions
			.get(stored.current)
			.map(|(v, _)| v.clone())
			.unwrap_or(RequestedVersion::Default)
	}

	/// Tries to get the entrypoint for the version, if one can be found.
	pub async fn try_get_entrypoint(&self, version: &RequestedVersion) -> Option<PathBuf> {
		let mut state = self.state.load();
		if let Some((_, install_path)) = state.versions.iter().find(|(v, _)| v == version) {
			let p = PathBuf::from(install_path);
			if p.exists() {
				return Some(p);
			}
		}

		// For simple quality requests, see if that's installed already on the system
		let candidates = match &version {
			RequestedVersion::Default => match detect_installed_program(&self.log) {
				Ok(p) => p,
				Err(e) => {
					warning!(self.log, "error looking up installed applications: {}", e);
					return None;
				}
			},
			_ => return None,
		};

		let found = match candidates.into_iter().next() {
			Some(p) => p,
			None => return None,
		};

		// stash the found path for faster lookup
		self.store_version_path(&mut state, version.clone(), found.clone());
		if let Err(e) = self.state.save(state) {
			debug!(self.log, "error caching version path: {}", e);
		}

		Some(found)
	}
}

/// Shows a nice UI prompt to users asking them if they want to install the
/// requested version.
pub fn prompt_to_install(version: &RequestedVersion) {
	println!("No installation of {QUALITYLESS_PRODUCT_NAME} {version} was found.");

	if let RequestedVersion::Default = version {
		if let Some(uri) = PRODUCT_DOWNLOAD_URL {
			// todo: on some platforms, we may be able to help automate installation. For example,
			// we can unzip the app ourselves on macOS and on windows we can download and spawn the GUI installer
			#[cfg(target_os = "linux")]
			println!("Install it from your system's package manager or {uri}, restart your shell, and try again.");
			#[cfg(target_os = "macos")]
			println!("Download and unzip it from {} and try again.", uri);
			#[cfg(target_os = "windows")]
			println!("Install it from {} and try again.", uri);
		}
	}

	println!();
	println!("If you already installed {} and we didn't detect it, run `{} --install-dir /path/to/installation`", QUALITYLESS_PRODUCT_NAME, version.get_command());
}

#[cfg(target_os = "macos")]
fn detect_installed_program(log: &log::Logger) -> io::Result<Vec<PathBuf>> {
	use crate::constants::PRODUCT_NAME_LONG;

	// easy, fast detection for where apps are usually installed
	let mut probable = PathBuf::from("/Applications");
	probable.push(format!("{}.app", PRODUCT_NAME_LONG));
	if probable.exists() {
		probable.extend(["Contents/Resources", "app", "bin", "code"]);
		return Ok(vec![probable]);
	}

	// _Much_ slower detection using the system_profiler (~10s for me). While the
	// profiler can output nicely structure plist xml, pulling in an xml parser
	// just for this is overkill. The default output looks something like...
	//
	//     Visual Studio Code - Exploration 2:
	//
	//        Version: 1.73.0-exploration
	//        Obtained from: Identified Developer
	//        Last Modified: 9/23/22, 10:16 AM
	//        Kind: Intel
	//        Signed by: Developer ID Application: Microsoft Corporation (UBF8T346G9), Developer ID Certification Authority, Apple Root CA
	//        Location: /Users/connor/Downloads/Visual Studio Code - Exploration 2.app
	//
	// So, use a simple state machine that looks for the first line, and then for
	// the `Location:` line for the path.
	info!(log, "Searching for installations on your machine, this is done once and will take about 10 seconds...");

	let stdout = new_std_command("system_profiler")
		.args(["SPApplicationsDataType", "-detailLevel", "mini"])
		.output()?
		.stdout;

	enum State {
		LookingForName,
		LookingForLocation,
	}

	let mut state = State::LookingForName;
	let mut output: Vec<PathBuf> = vec![];
	const LOCATION_PREFIX: &str = "Location:";
	for mut line in String::from_utf8_lossy(&stdout).lines() {
		line = line.trim();
		match state {
			State::LookingForName => {
				if line.starts_with(PRODUCT_NAME_LONG) && line.ends_with(':') {
					state = State::LookingForLocation;
				}
			}
			State::LookingForLocation => {
				if let Some(suffix) = line.strip_prefix(LOCATION_PREFIX) {
					output.push(
						[suffix.trim(), "Contents/Resources", "app", "bin", "code"]
							.iter()
							.collect(),
					);
					state = State::LookingForName;
				}
			}
		}
	}

	// Sort shorter paths to the front, preferring "more global" installs, and
	// incidentally preferring local installs over Parallels 'installs'.
	output.sort_by_key(|a| a.as_os_str().len());

	Ok(output)
}

#[cfg(windows)]
fn detect_installed_program(_log: &log::Logger) -> io::Result<Vec<PathBuf>> {
	use crate::constants::{APPLICATION_NAME, WIN32_APP_IDS};
	use winreg::enums::{HKEY_CURRENT_USER, HKEY_LOCAL_MACHINE};
	use winreg::RegKey;

	let mut output: Vec<PathBuf> = vec![];
	let app_ids = match WIN32_APP_IDS.as_ref() {
		Some(ids) => ids,
		None => return Ok(output),
	};

	let scopes = [
		(
			HKEY_LOCAL_MACHINE,
			"SOFTWARE\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall",
		),
		(
			HKEY_LOCAL_MACHINE,
			"SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall",
		),
		(
			HKEY_CURRENT_USER,
			"SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall",
		),
	];

	for (scope, key) in scopes {
		let cur_ver = match RegKey::predef(scope).open_subkey(key) {
			Ok(k) => k,
			Err(_) => continue,
		};

		for key in cur_ver.enum_keys().flatten() {
			if app_ids.iter().any(|id| key.contains(id)) {
				let sk = cur_ver.open_subkey(&key)?;
				if let Ok(location) = sk.get_value::<String, _>("InstallLocation") {
					output.push(
						[
							location.as_str(),
							"bin",
							&format!("{}.cmd", APPLICATION_NAME),
						]
						.iter()
						.collect(),
					)
				}
			}
		}
	}

	Ok(output)
}

// Looks for the given binary name in the PATH, returning all candidate matches.
// Based on https://github.dev/microsoft/vscode-js-debug/blob/7594d05518df6700df51771895fcad0ddc7f92f9/src/common/pathUtils.ts#L15
#[cfg(target_os = "linux")]
fn detect_installed_program(log: &log::Logger) -> io::Result<Vec<PathBuf>> {
	use crate::constants::APPLICATION_NAME;

	let path = match std::env::var("PATH") {
		Ok(p) => p,
		Err(e) => {
			info!(log, "PATH is empty ({}), skipping detection", e);
			return Ok(vec![]);
		}
	};

	let current_exe = std::env::current_exe().expect("expected to read current exe");
	let mut output = vec![];
	for dir in path.split(':') {
		let target: PathBuf = [dir, APPLICATION_NAME].iter().collect();
		match std::fs::canonicalize(&target) {
			Ok(m) if m == current_exe => continue,
			Ok(_) => {}
			Err(_) => continue,
		};

		// note: intentionally store the non-canonicalized version, since if it's a
		// symlink, (1) it's probably desired to use it and (2) resolving the link
		// breaks snap installations.
		output.push(target);
	}

	Ok(output)
}

const DESKTOP_CLI_RELATIVE_PATH: &str = if cfg!(target_os = "macos") {
	"Contents/Resources/app/bin/code"
} else if cfg!(target_os = "windows") {
	"bin/code.cmd,bin/code-insiders.cmd,bin/code-exploration.cmd"
} else {
	"bin/code,bin/code-insiders,bin/code-exploration"
};

#[cfg(test)]
mod tests {
	use std::{
		fs::{create_dir_all, File},
		io::Write,
	};

	use super::*;

	fn make_fake_vscode_install(path: &Path) {
		let bin = DESKTOP_CLI_RELATIVE_PATH
			.split(',')
			.next()
			.expect("expected exe path");

		let binary_file_path = path.join(bin);
		let parent_dir_path = binary_file_path.parent().expect("expected parent path");

		create_dir_all(parent_dir_path).expect("expected to create parent dir");

		let mut binary_file = File::create(binary_file_path).expect("expected to make file");
		binary_file
			.write_all(b"")
			.expect("expected to write binary");
	}

	fn make_multiple_vscode_install() -> tempfile::TempDir {
		let dir = tempfile::tempdir().expect("expected to make temp dir");
		make_fake_vscode_install(&dir.path().join("desktop/stable"));
		make_fake_vscode_install(&dir.path().join("desktop/1.68.2"));
		dir
	}

	#[test]
	fn test_detect_installed_program() {
		// developers can run this test and debug output manually; VS Code will not
		// be installed in CI, so the test only makes sure it doesn't error out
		let result = detect_installed_program(&log::Logger::test());
		println!("result: {result:?}");
		assert!(result.is_ok());
	}

	#[tokio::test]
	async fn test_set_preferred_version() {
		let dir = make_multiple_vscode_install();
		let lp = LauncherPaths::new_without_replacements(dir.path().to_owned());
		let vm1 = CodeVersionManager::new(log::Logger::test(), &lp, Platform::LinuxARM64);

		assert_eq!(vm1.get_preferred_version(), RequestedVersion::Default);
		vm1.set_preferred_version(
			RequestedVersion::Commit("foobar".to_string()),
			dir.path().join("desktop/stable"),
		)
		.await
		.expect("expected to store");
		vm1.set_preferred_version(
			RequestedVersion::Commit("foobar2".to_string()),
			dir.path().join("desktop/stable"),
		)
		.await
		.expect("expected to store");

		assert_eq!(
			vm1.get_preferred_version(),
			RequestedVersion::Commit("foobar2".to_string()),
		);

		let vm2 = CodeVersionManager::new(log::Logger::test(), &lp, Platform::LinuxARM64);
		assert_eq!(
			vm2.get_preferred_version(),
			RequestedVersion::Commit("foobar2".to_string()),
		);
	}

	#[tokio::test]
	async fn test_gets_entrypoint() {
		let dir = make_multiple_vscode_install();

		assert!(CodeVersionManager::get_entrypoint_for_install_dir(
			&dir.path().join("desktop").join("stable")
		)
		.await
		.is_some());

		assert!(
			CodeVersionManager::get_entrypoint_for_install_dir(&dir.path().join("invalid"))
				.await
				.is_none()
		);
	}

	#[tokio::test]
	async fn test_gets_entrypoint_as_binary() {
		let dir = tempfile::tempdir().expect("expected to make temp dir");

		#[cfg(windows)]
		let binary_file_path = {
			let path = dir.path().join("code.cmd");
			File::create(&path).expect("expected to create file");
			path
		};

		#[cfg(unix)]
		let binary_file_path = {
			use std::fs;
			use std::os::unix::fs::PermissionsExt;

			let path = dir.path().join("code");
			{
				let mut f = File::create(&path).expect("expected to create file");
				f.write_all(b"#!/bin/sh")
					.expect("expected to write to file");
			}
			fs::set_permissions(&path, fs::Permissions::from_mode(0o777))
				.expect("expected to set permissions");
			path
		};

		assert_eq!(
			CodeVersionManager::get_entrypoint_for_install_dir(&binary_file_path).await,
			Some(binary_file_path)
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/tunnels/challenge.rs]---
Location: vscode-main/cli/src/tunnels/challenge.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

#[cfg(not(feature = "vsda"))]
pub fn create_challenge() -> String {
	use rand::distributions::{Alphanumeric, DistString};
	Alphanumeric.sample_string(&mut rand::thread_rng(), 16)
}

#[cfg(not(feature = "vsda"))]
pub fn sign_challenge(challenge: &str) -> String {
	use base64::{engine::general_purpose as b64, Engine as _};
	use sha2::{Digest, Sha256};
	let mut hash = Sha256::new();
	hash.update(challenge.as_bytes());
	let result = hash.finalize();
	b64::URL_SAFE_NO_PAD.encode(result)
}

#[cfg(not(feature = "vsda"))]
pub fn verify_challenge(challenge: &str, response: &str) -> bool {
	sign_challenge(challenge) == response
}

#[cfg(feature = "vsda")]
pub fn create_challenge() -> String {
	use rand::distributions::{Alphanumeric, DistString};
	let str = Alphanumeric.sample_string(&mut rand::thread_rng(), 16);
	vsda::create_new_message(&str)
}

#[cfg(feature = "vsda")]
pub fn sign_challenge(challenge: &str) -> String {
	vsda::sign(challenge)
}

#[cfg(feature = "vsda")]
pub fn verify_challenge(challenge: &str, response: &str) -> bool {
	vsda::validate(challenge, response)
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/tunnels/code_server.rs]---
Location: vscode-main/cli/src/tunnels/code_server.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
use super::paths::{InstalledServer, ServerPaths};
use crate::async_pipe::get_socket_name;
use crate::constants::{
	APPLICATION_NAME, EDITOR_WEB_URL, QUALITYLESS_PRODUCT_NAME, QUALITYLESS_SERVER_NAME,
};
use crate::download_cache::DownloadCache;
use crate::options::{Quality, TelemetryLevel};
use crate::state::LauncherPaths;
use crate::tunnels::paths::{get_server_folder_name, SERVER_FOLDER_NAME};
use crate::update_service::{
	unzip_downloaded_release, Platform, Release, TargetKind, UpdateService,
};
use crate::util::command::{
	capture_command, capture_command_and_check_status, check_output_status, kill_tree,
	new_script_command,
};
use crate::util::errors::{wrap, AnyError, CodeError, ExtensionInstallFailed, WrappedError};
use crate::util::http::{self, BoxedHttp};
use crate::util::io::SilentCopyProgress;
use crate::util::machine::process_exists;
use crate::util::prereqs::skip_requirements_check;
use crate::{debug, info, log, spanf, trace, warning};
use lazy_static::lazy_static;
use opentelemetry::KeyValue;
use regex::Regex;
use serde::Deserialize;
use std::fs;
use std::fs::File;
use std::io::Write;
use std::path::{Path, PathBuf};
use std::sync::Arc;
use std::time::Duration;
use tokio::fs::remove_file;
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::{Child, Command};
use tokio::sync::oneshot::Receiver;
use tokio::time::{interval, timeout};

lazy_static! {
	static ref LISTENING_PORT_RE: Regex =
		Regex::new(r"Extension host agent listening on (.+)").unwrap();
	static ref WEB_UI_RE: Regex = Regex::new(r"Web UI available at (.+)").unwrap();
}

#[derive(Clone, Debug, Default)]
pub struct CodeServerArgs {
	pub host: Option<String>,
	pub port: Option<u16>,
	pub socket_path: Option<String>,

	// common argument
	pub telemetry_level: Option<TelemetryLevel>,
	pub log: Option<log::Level>,
	pub accept_server_license_terms: bool,
	pub verbose: bool,
	pub server_data_dir: Option<String>,
	pub extensions_dir: Option<String>,
	// extension management
	pub install_extensions: Vec<String>,
	pub uninstall_extensions: Vec<String>,
	pub update_extensions: bool,
	pub list_extensions: bool,
	pub show_versions: bool,
	pub category: Option<String>,
	pub pre_release: bool,
	pub donot_include_pack_and_dependencies: bool,
	pub force: bool,
	pub start_server: bool,
	// connection tokens
	pub connection_token: Option<String>,
	pub connection_token_file: Option<String>,
	pub without_connection_token: bool,
	// reconnection
	pub reconnection_grace_time: Option<u32>,
}

impl CodeServerArgs {
	pub fn log_level(&self) -> log::Level {
		if self.verbose {
			log::Level::Trace
		} else {
			self.log.unwrap_or(log::Level::Info)
		}
	}

	pub fn telemetry_disabled(&self) -> bool {
		self.telemetry_level == Some(TelemetryLevel::Off)
	}

	pub fn command_arguments(&self) -> Vec<String> {
		let mut args = Vec::new();
		if let Some(i) = &self.socket_path {
			args.push(format!("--socket-path={i}"));
		} else {
			if let Some(i) = &self.host {
				args.push(format!("--host={i}"));
			}
			if let Some(i) = &self.port {
				args.push(format!("--port={i}"));
			}
		}

		if let Some(i) = &self.connection_token {
			args.push(format!("--connection-token={i}"));
		}
		if let Some(i) = &self.connection_token_file {
			args.push(format!("--connection-token-file={i}"));
		}
		if self.without_connection_token {
			args.push(String::from("--without-connection-token"));
		}
		if self.accept_server_license_terms {
			args.push(String::from("--accept-server-license-terms"));
		}
		if let Some(i) = self.telemetry_level {
			args.push(format!("--telemetry-level={i}"));
		}
		if let Some(i) = self.log {
			args.push(format!("--log={i}"));
		}
		if let Some(t) = self.reconnection_grace_time {
			args.push(format!("--reconnection-grace-time={t}"));
		}

		for extension in &self.install_extensions {
			args.push(format!("--install-extension={extension}"));
		}
		if !&self.install_extensions.is_empty() {
			if self.pre_release {
				args.push(String::from("--pre-release"));
			}
			if self.force {
				args.push(String::from("--force"));
			}
		}
		for extension in &self.uninstall_extensions {
			args.push(format!("--uninstall-extension={extension}"));
		}
		if self.update_extensions {
			args.push(String::from("--update-extensions"));
		}
		if self.list_extensions {
			args.push(String::from("--list-extensions"));
			if self.show_versions {
				args.push(String::from("--show-versions"));
			}
			if let Some(i) = &self.category {
				args.push(format!("--category={i}"));
			}
		}
		if let Some(d) = &self.server_data_dir {
			args.push(format!("--server-data-dir={d}"));
		}
		if let Some(d) = &self.extensions_dir {
			args.push(format!("--extensions-dir={d}"));
		}
		if self.start_server {
			args.push(String::from("--start-server"));
		}
		args
	}
}

/// Base server params that can be `resolve()`d to a `ResolvedServerParams`.
/// Doing so fetches additional information like a commit ID if previously
/// unspecified.
pub struct ServerParamsRaw {
	pub commit_id: Option<String>,
	pub quality: Quality,
	pub code_server_args: CodeServerArgs,
	pub headless: bool,
	pub platform: Platform,
}

/// Server params that can be used to start a VS Code server.
pub struct ResolvedServerParams {
	pub release: Release,
	pub code_server_args: CodeServerArgs,
}

impl ResolvedServerParams {
	fn as_installed_server(&self) -> InstalledServer {
		InstalledServer {
			commit: self.release.commit.clone(),
			quality: self.release.quality,
			headless: self.release.target == TargetKind::Server,
		}
	}
}

impl ServerParamsRaw {
	pub async fn resolve(
		self,
		log: &log::Logger,
		http: BoxedHttp,
	) -> Result<ResolvedServerParams, AnyError> {
		Ok(ResolvedServerParams {
			release: self.get_or_fetch_commit_id(log, http).await?,
			code_server_args: self.code_server_args,
		})
	}

	async fn get_or_fetch_commit_id(
		&self,
		log: &log::Logger,
		http: BoxedHttp,
	) -> Result<Release, AnyError> {
		let target = match self.headless {
			true => TargetKind::Server,
			false => TargetKind::Web,
		};

		if let Some(c) = &self.commit_id {
			return Ok(Release {
				commit: c.clone(),
				quality: self.quality,
				target,
				name: String::new(),
				platform: self.platform,
			});
		}

		UpdateService::new(log.clone(), http)
			.get_latest_commit(self.platform, target, self.quality)
			.await
	}
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
#[allow(dead_code)]
struct UpdateServerVersion {
	pub name: String,
	pub version: String,
	pub product_version: String,
	pub timestamp: i64,
}

/// Code server listening on a port address.
#[derive(Clone)]
pub struct SocketCodeServer {
	pub commit_id: String,
	pub socket: PathBuf,
	pub origin: Arc<CodeServerOrigin>,
}

/// Code server listening on a socket address.
#[derive(Clone)]
pub struct PortCodeServer {
	pub commit_id: String,
	pub port: u16,
	pub origin: Arc<CodeServerOrigin>,
}

/// A server listening on any address/location.
pub enum AnyCodeServer {
	Socket(SocketCodeServer),
	Port(PortCodeServer),
}

pub enum CodeServerOrigin {
	/// A new code server, that opens the barrier when it exits.
	New(Box<Child>),
	/// An existing code server with a PID.
	Existing(u32),
}

impl CodeServerOrigin {
	pub async fn wait_for_exit(&mut self) {
		match self {
			CodeServerOrigin::New(child) => {
				child.wait().await.ok();
			}
			CodeServerOrigin::Existing(pid) => {
				let mut interval = interval(Duration::from_secs(30));
				while process_exists(*pid) {
					interval.tick().await;
				}
			}
		}
	}

	pub async fn kill(&mut self) {
		match self {
			CodeServerOrigin::New(child) => {
				child.kill().await.ok();
			}
			CodeServerOrigin::Existing(pid) => {
				kill_tree(*pid).await.ok();
			}
		}
	}
}

/// Ensures the given list of extensions are installed on the running server.
async fn do_extension_install_on_running_server(
	start_script_path: &Path,
	extensions: &[String],
	log: &log::Logger,
) -> Result<(), AnyError> {
	if extensions.is_empty() {
		return Ok(());
	}

	debug!(log, "Installing extensions...");
	let command = format!(
		"{} {}",
		start_script_path.display(),
		extensions
			.iter()
			.map(|s| get_extensions_flag(s))
			.collect::<Vec<String>>()
			.join(" ")
	);

	let result = capture_command("bash", &["-c", &command]).await?;
	if !result.status.success() {
		Err(AnyError::from(ExtensionInstallFailed(
			String::from_utf8_lossy(&result.stderr).to_string(),
		)))
	} else {
		Ok(())
	}
}

pub struct ServerBuilder<'a> {
	logger: &'a log::Logger,
	server_params: &'a ResolvedServerParams,
	launcher_paths: &'a LauncherPaths,
	server_paths: ServerPaths,
	http: BoxedHttp,
}

impl<'a> ServerBuilder<'a> {
	pub fn new(
		logger: &'a log::Logger,
		server_params: &'a ResolvedServerParams,
		launcher_paths: &'a LauncherPaths,
		http: BoxedHttp,
	) -> Self {
		Self {
			logger,
			server_params,
			launcher_paths,
			server_paths: server_params
				.as_installed_server()
				.server_paths(launcher_paths),
			http,
		}
	}

	/// Gets any already-running server from this directory.
	pub async fn get_running(&self) -> Result<Option<AnyCodeServer>, AnyError> {
		info!(
			self.logger,
			"Checking {} and {} for a running server...",
			self.server_paths.logfile.display(),
			self.server_paths.pidfile.display()
		);

		let pid = match self.server_paths.get_running_pid() {
			Some(pid) => pid,
			None => return Ok(None),
		};
		info!(self.logger, "Found running server (pid={})", pid);
		if !Path::new(&self.server_paths.logfile).exists() {
			warning!(self.logger, "{} Server is running but its logfile is missing. Don't delete the {} Server manually, run the command '{} prune'.", QUALITYLESS_PRODUCT_NAME, QUALITYLESS_PRODUCT_NAME, APPLICATION_NAME);
			return Ok(None);
		}

		do_extension_install_on_running_server(
			&self.server_paths.executable,
			&self.server_params.code_server_args.install_extensions,
			self.logger,
		)
		.await?;

		let origin = Arc::new(CodeServerOrigin::Existing(pid));
		let contents = fs::read_to_string(&self.server_paths.logfile)
			.expect("Something went wrong reading log file");

		if let Some(port) = parse_port_from(&contents) {
			Ok(Some(AnyCodeServer::Port(PortCodeServer {
				commit_id: self.server_params.release.commit.to_owned(),
				port,
				origin,
			})))
		} else if let Some(socket) = parse_socket_from(&contents) {
			Ok(Some(AnyCodeServer::Socket(SocketCodeServer {
				commit_id: self.server_params.release.commit.to_owned(),
				socket,
				origin,
			})))
		} else {
			Ok(None)
		}
	}

	/// Removes a cached server.
	pub async fn evict(&self) -> Result<(), WrappedError> {
		let name = get_server_folder_name(
			self.server_params.release.quality,
			&self.server_params.release.commit,
		);

		self.launcher_paths.server_cache.delete(&name)
	}

	/// Ensures the server is set up in the configured directory.
	pub async fn setup(&self) -> Result<(), AnyError> {
		debug!(
			self.logger,
			"Installing and setting up {}...", QUALITYLESS_SERVER_NAME
		);

		let update_service = UpdateService::new(self.logger.clone(), self.http.clone());
		let name = get_server_folder_name(
			self.server_params.release.quality,
			&self.server_params.release.commit,
		);

		let result = self
			.launcher_paths
			.server_cache
			.create(name, |target_dir| async move {
				let tmpdir =
					tempfile::tempdir().map_err(|e| wrap(e, "error creating temp download dir"))?;

				let response = update_service
					.get_download_stream(&self.server_params.release)
					.await?;
				let archive_path = tmpdir.path().join(response.url_path_basename().unwrap());

				info!(
					self.logger,
					"Downloading {} server -> {}",
					QUALITYLESS_PRODUCT_NAME,
					archive_path.display()
				);

				http::download_into_file(
					&archive_path,
					self.logger.get_download_logger("server download progress:"),
					response,
				)
				.await?;

				let server_dir = target_dir.join(SERVER_FOLDER_NAME);
				unzip_downloaded_release(
					&archive_path,
					&server_dir,
					self.logger.get_download_logger("server inflate progress:"),
				)?;

				if !skip_requirements_check().await {
					let output = capture_command_and_check_status(
						server_dir
							.join("bin")
							.join(self.server_params.release.quality.server_entrypoint()),
						&["--version"],
					)
					.await
					.map_err(|e| wrap(e, "error checking server integrity"))?;

					trace!(
						self.logger,
						"Server integrity verified, version: {}",
						String::from_utf8_lossy(&output.stdout).replace('\n', " / ")
					);
				} else {
					info!(self.logger, "Skipping server integrity check");
				}

				Ok(())
			})
			.await;

		if let Err(e) = result {
			error!(self.logger, "Error installing server: {}", e);
			return Err(e);
		}

		debug!(self.logger, "Server setup complete");

		Ok(())
	}

	pub async fn listen_on_port(&self, port: u16) -> Result<PortCodeServer, AnyError> {
		let mut cmd = self.get_base_command();
		cmd.arg("--start-server")
			.arg("--enable-remote-auto-shutdown")
			.arg(format!("--port={port}"));

		let child = self.spawn_server_process(cmd).await?;
		let log_file = self.get_logfile()?;
		let plog = self.logger.prefixed(&log::new_code_server_prefix());

		let (mut origin, listen_rx) =
			monitor_server::<PortMatcher, u16>(child, Some(log_file), plog, false);

		let port = match timeout(Duration::from_secs(8), listen_rx).await {
			Err(_) => {
				origin.kill().await;
				return Err(CodeError::ServerOriginTimeout.into());
			}
			Ok(Err(s)) => {
				origin.kill().await;
				return Err(CodeError::ServerUnexpectedExit(format!("{s}")).into());
			}
			Ok(Ok(p)) => p,
		};

		info!(self.logger, "Server started");

		Ok(PortCodeServer {
			commit_id: self.server_params.release.commit.to_owned(),
			port,
			origin: Arc::new(origin),
		})
	}

	/// Runs the command that just installs extensions and exits.
	pub async fn install_extensions(&self) -> Result<(), AnyError> {
		// cmd already has --install-extensions from base
		let mut cmd = self.get_base_command();
		let cmd_str = || {
			self.server_params
				.code_server_args
				.command_arguments()
				.join(" ")
		};

		let r = cmd.output().await.map_err(|e| CodeError::CommandFailed {
			command: cmd_str(),
			code: -1,
			output: e.to_string(),
		})?;

		check_output_status(r, cmd_str)?;

		Ok(())
	}

	pub async fn listen_on_default_socket(&self) -> Result<SocketCodeServer, AnyError> {
		let requested_file = get_socket_name();
		self.listen_on_socket(&requested_file).await
	}

	pub async fn listen_on_socket(&self, socket: &Path) -> Result<SocketCodeServer, AnyError> {
		Ok(spanf!(
			self.logger,
			self.logger.span("server.start").with_attributes(vec! {
				KeyValue::new("commit_id", self.server_params.release.commit.to_string()),
				KeyValue::new("quality", format!("{}", self.server_params.release.quality)),
			}),
			self._listen_on_socket(socket)
		)?)
	}

	async fn _listen_on_socket(&self, socket: &Path) -> Result<SocketCodeServer, AnyError> {
		remove_file(&socket).await.ok(); // ignore any error if it doesn't exist

		let mut cmd = self.get_base_command();
		cmd.arg("--start-server")
			.arg("--enable-remote-auto-shutdown")
			.arg(format!("--socket-path={}", socket.display()));

		let child = self.spawn_server_process(cmd).await?;
		let log_file = self.get_logfile()?;
		let plog = self.logger.prefixed(&log::new_code_server_prefix());

		let (mut origin, listen_rx) =
			monitor_server::<SocketMatcher, PathBuf>(child, Some(log_file), plog, false);

		let socket = match timeout(Duration::from_secs(30), listen_rx).await {
			Err(_) => {
				origin.kill().await;
				return Err(CodeError::ServerOriginTimeout.into());
			}
			Ok(Err(s)) => {
				origin.kill().await;
				return Err(CodeError::ServerUnexpectedExit(format!("{s}")).into());
			}
			Ok(Ok(socket)) => socket,
		};

		info!(self.logger, "Server started");

		Ok(SocketCodeServer {
			commit_id: self.server_params.release.commit.to_owned(),
			socket,
			origin: Arc::new(origin),
		})
	}

	async fn spawn_server_process(&self, mut cmd: Command) -> Result<Child, AnyError> {
		info!(self.logger, "Starting server...");

		debug!(self.logger, "Starting server with command... {:?}", cmd);

		// On Windows spawning a code-server binary will run cmd.exe /c C:\path\to\code-server.cmd...
		// This spawns a cmd.exe window for the user, which if they close will kill the code-server process
		// and disconnect the tunnel. To prevent this, pass the CREATE_NO_WINDOW flag to the Command
		// only on Windows.
		// Original issue: https://github.com/microsoft/vscode/issues/184058
		// Partial fix: https://github.com/microsoft/vscode/pull/184621
		#[cfg(target_os = "windows")]
		let cmd = cmd.creation_flags(
			winapi::um::winbase::CREATE_NO_WINDOW
				| winapi::um::winbase::CREATE_NEW_PROCESS_GROUP
				| get_should_use_breakaway_from_job()
					.await
					.then_some(winapi::um::winbase::CREATE_BREAKAWAY_FROM_JOB)
					.unwrap_or_default(),
		);

		let child = cmd
			.stderr(std::process::Stdio::piped())
			.stdout(std::process::Stdio::piped())
			.spawn()
			.map_err(|e| CodeError::ServerUnexpectedExit(format!("{e}")))?;

		self.server_paths
			.write_pid(child.id().expect("expected server to have pid"))?;

		Ok(child)
	}

	fn get_logfile(&self) -> Result<File, WrappedError> {
		File::create(&self.server_paths.logfile).map_err(|e| {
			wrap(
				e,
				format!(
					"error creating log file {}",
					self.server_paths.logfile.display()
				),
			)
		})
	}

	fn get_base_command(&self) -> Command {
		let mut cmd = new_script_command(&self.server_paths.executable);
		cmd.stdin(std::process::Stdio::null())
			.args(self.server_params.code_server_args.command_arguments());
		cmd
	}
}

fn monitor_server<M, R>(
	mut child: Child,
	log_file: Option<File>,
	plog: log::Logger,
	write_directly: bool,
) -> (CodeServerOrigin, Receiver<R>)
where
	M: ServerOutputMatcher<R>,
	R: 'static + Send + std::fmt::Debug,
{
	let stdout = child
		.stdout
		.take()
		.expect("child did not have a handle to stdout");

	let stderr = child
		.stderr
		.take()
		.expect("child did not have a handle to stdout");

	let (listen_tx, listen_rx) = tokio::sync::oneshot::channel();

	// Handle stderr and stdout in a separate task. Initially scan lines looking
	// for the listening port. Afterwards, just scan and write out to the file.
	tokio::spawn(async move {
		let mut stdout_reader = BufReader::new(stdout).lines();
		let mut stderr_reader = BufReader::new(stderr).lines();
		let write_line = |line: &str| -> std::io::Result<()> {
			if let Some(mut f) = log_file.as_ref() {
				f.write_all(line.as_bytes())?;
				f.write_all(b"\n")?;
			}
			if write_directly {
				println!("{line}");
			} else {
				trace!(plog, line);
			}
			Ok(())
		};

		loop {
			let line = tokio::select! {
				l = stderr_reader.next_line() => l,
				l = stdout_reader.next_line() => l,
			};

			match line {
				Err(e) => {
					trace!(plog, "error reading from stdout/stderr: {}", e);
					return;
				}
				Ok(None) => break,
				Ok(Some(l)) => {
					write_line(&l).ok();

					if let Some(listen_on) = M::match_line(&l) {
						trace!(plog, "parsed location: {:?}", listen_on);
						listen_tx.send(listen_on).ok();
						break;
					}
				}
			}
		}

		loop {
			let line = tokio::select! {
				l = stderr_reader.next_line() => l,
				l = stdout_reader.next_line() => l,
			};

			match line {
				Err(e) => {
					trace!(plog, "error reading from stdout/stderr: {}", e);
					break;
				}
				Ok(None) => break,
				Ok(Some(l)) => {
					write_line(&l).ok();
				}
			}
		}
	});

	let origin = CodeServerOrigin::New(Box::new(child));
	(origin, listen_rx)
}

fn get_extensions_flag(extension_id: &str) -> String {
	format!("--install-extension={extension_id}")
}

/// A type that can be used to scan stdout from the VS Code server. Returns
/// some other type that, in turn, is returned from starting the server.
pub trait ServerOutputMatcher<R>
where
	R: Send,
{
	fn match_line(line: &str) -> Option<R>;
}

/// Parses a line like "Extension host agent listening on /tmp/foo.sock"
struct SocketMatcher();

impl ServerOutputMatcher<PathBuf> for SocketMatcher {
	fn match_line(line: &str) -> Option<PathBuf> {
		parse_socket_from(line)
	}
}

/// Parses a line like "Extension host agent listening on 9000"
pub struct PortMatcher();

impl ServerOutputMatcher<u16> for PortMatcher {
	fn match_line(line: &str) -> Option<u16> {
		parse_port_from(line)
	}
}

/// Parses a line like "Web UI available at http://localhost:9000/?tkn=..."
pub struct WebUiMatcher();

impl ServerOutputMatcher<reqwest::Url> for WebUiMatcher {
	fn match_line(line: &str) -> Option<reqwest::Url> {
		WEB_UI_RE.captures(line).and_then(|cap| {
			cap.get(1)
				.and_then(|uri| reqwest::Url::parse(uri.as_str()).ok())
		})
	}
}

/// Does not do any parsing and just immediately returns an empty result.
pub struct NoOpMatcher();

impl ServerOutputMatcher<()> for NoOpMatcher {
	fn match_line(_: &str) -> Option<()> {
		Some(())
	}
}

fn parse_socket_from(text: &str) -> Option<PathBuf> {
	LISTENING_PORT_RE
		.captures(text)
		.and_then(|cap| cap.get(1).map(|path| PathBuf::from(path.as_str())))
}

fn parse_port_from(text: &str) -> Option<u16> {
	LISTENING_PORT_RE.captures(text).and_then(|cap| {
		cap.get(1)
			.and_then(|path| path.as_str().parse::<u16>().ok())
	})
}

pub fn print_listening(log: &log::Logger, tunnel_name: &str) {
	debug!(
		log,
		"{} is listening for incoming connections", QUALITYLESS_SERVER_NAME
	);

	let home_dir = dirs::home_dir().unwrap_or_else(|| PathBuf::from(""));
	let current_dir = std::env::current_dir().unwrap_or_else(|_| PathBuf::from(""));

	let dir = if home_dir == current_dir {
		PathBuf::from("")
	} else {
		current_dir
	};

	let base_web_url = match EDITOR_WEB_URL {
		Some(u) => u,
		None => return,
	};

	let mut addr = url::Url::parse(base_web_url).unwrap();
	{
		let mut ps = addr.path_segments_mut().unwrap();
		ps.push("tunnel");
		ps.push(tunnel_name);
		for segment in &dir {
			let as_str = segment.to_string_lossy();
			if !(as_str.len() == 1 && as_str.starts_with(std::path::MAIN_SEPARATOR)) {
				ps.push(as_str.as_ref());
			}
		}
	}

	let message = &format!("\nOpen this link in your browser {addr}\n");
	log.result(message);
}

pub async fn download_cli_into_cache(
	cache: &DownloadCache,
	release: &Release,
	update_service: &UpdateService,
) -> Result<PathBuf, AnyError> {
	let cache_name = format!(
		"{}-{}-{}",
		release.quality, release.commit, release.platform
	);
	let cli_dir = cache
		.create(&cache_name, |target_dir| async move {
			let tmpdir =
				tempfile::tempdir().map_err(|e| wrap(e, "error creating temp download dir"))?;
			let response = update_service.get_download_stream(release).await?;

			let name = response.url_path_basename().unwrap();
			let archive_path = tmpdir.path().join(name);
			http::download_into_file(&archive_path, SilentCopyProgress(), response).await?;
			unzip_downloaded_release(&archive_path, &target_dir, SilentCopyProgress())?;
			Ok(())
		})
		.await?;

	let cli = std::fs::read_dir(cli_dir)
		.map_err(|_| CodeError::CorruptDownload("could not read cli folder contents"))?
		.next();

	match cli {
		Some(Ok(cli)) => Ok(cli.path()),
		_ => {
			let _ = cache.delete(&cache_name);
			Err(CodeError::CorruptDownload("cli directory is empty").into())
		}
	}
}

#[cfg(target_os = "windows")]
async fn get_should_use_breakaway_from_job() -> bool {
	let mut cmd = Command::new("cmd");
	cmd.creation_flags(
		winapi::um::winbase::CREATE_NO_WINDOW | winapi::um::winbase::CREATE_BREAKAWAY_FROM_JOB,
	);

	cmd.args(["/C", "echo ok"]).output().await.is_ok()
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/tunnels/control_server.rs]---
Location: vscode-main/cli/src/tunnels/control_server.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
use crate::async_pipe::get_socket_rw_stream;
use crate::constants::{CONTROL_PORT, PRODUCT_NAME_LONG};
use crate::log;
use crate::msgpack_rpc::{new_msgpack_rpc, start_msgpack_rpc, MsgPackCodec, MsgPackSerializer};
use crate::options::Quality;
use crate::rpc::{MaybeSync, RpcBuilder, RpcCaller, RpcDispatcher};
use crate::self_update::SelfUpdate;
use crate::state::LauncherPaths;
use crate::tunnels::protocol::{HttpRequestParams, PortPrivacy, METHOD_CHALLENGE_ISSUE};
use crate::tunnels::socket_signal::CloseReason;
use crate::update_service::{Platform, Release, TargetKind, UpdateService};
use crate::util::command::new_tokio_command;
use crate::util::errors::{
	wrap, AnyError, CodeError, MismatchedLaunchModeError, NoAttachedServerError,
};
use crate::util::http::{
	DelegatedHttpRequest, DelegatedSimpleHttp, FallbackSimpleHttp, ReqwestSimpleHttp,
};
use crate::util::io::SilentCopyProgress;
use crate::util::is_integrated_cli;
use crate::util::machine::kill_pid;
use crate::util::os::os_release;
use crate::util::sync::{new_barrier, Barrier, BarrierOpener};

use futures::stream::FuturesUnordered;
use futures::FutureExt;
use opentelemetry::trace::SpanKind;
use opentelemetry::KeyValue;
use std::collections::HashMap;
use std::path::PathBuf;
use std::process::Stdio;
use tokio::net::TcpStream;
use tokio::pin;
use tokio::process::{ChildStderr, ChildStdin};
use tokio_util::codec::Decoder;

use std::sync::atomic::{AtomicBool, AtomicU32, AtomicUsize, Ordering};
use std::sync::Arc;
use std::time::Instant;
use tokio::io::{AsyncRead, AsyncReadExt, AsyncWrite, AsyncWriteExt, BufReader, DuplexStream};
use tokio::sync::{mpsc, Mutex};

use super::challenge::{create_challenge, sign_challenge, verify_challenge};
use super::code_server::{
	download_cli_into_cache, AnyCodeServer, CodeServerArgs, ServerBuilder, ServerParamsRaw,
	SocketCodeServer,
};
use super::dev_tunnels::ActiveTunnel;
use super::paths::prune_stopped_servers;
use super::port_forwarder::{PortForwarding, PortForwardingProcessor};
use super::protocol::{
	AcquireCliParams, CallServerHttpParams, CallServerHttpResult, ChallengeIssueParams,
	ChallengeIssueResponse, ChallengeVerifyParams, ClientRequestMethod, EmptyObject, ForwardParams,
	ForwardResult, FsReadDirEntry, FsReadDirResponse, FsRenameRequest, FsSinglePathRequest,
	FsStatResponse, GetEnvResponse, GetHostnameResponse, HttpBodyParams, HttpHeadersParams,
	NetConnectRequest, ServeParams, ServerLog, ServerMessageParams, SpawnParams, SpawnResult,
	SysKillRequest, SysKillResponse, ToClientRequest, UnforwardParams, UpdateParams, UpdateResult,
	VersionResponse, METHOD_CHALLENGE_VERIFY,
};
use super::server_bridge::ServerBridge;
use super::server_multiplexer::ServerMultiplexer;
use super::shutdown_signal::ShutdownSignal;
use super::socket_signal::{
	ClientMessageDecoder, ServerMessageDestination, ServerMessageSink, SocketSignal,
};

type HttpRequestsMap = Arc<std::sync::Mutex<HashMap<u32, DelegatedHttpRequest>>>;
type CodeServerCell = Arc<Mutex<Option<SocketCodeServer>>>;

struct HandlerContext {
	/// Log handle for the server
	log: log::Logger,
	/// Whether the server update during the handler session.
	did_update: Arc<AtomicBool>,
	/// Whether authentication is still required on the socket.
	auth_state: Arc<std::sync::Mutex<AuthState>>,
	/// A loopback channel to talk to the socket server task.
	socket_tx: mpsc::Sender<SocketSignal>,
	/// Configured launcher paths.
	launcher_paths: LauncherPaths,
	/// Connected VS Code Server
	code_server: CodeServerCell,
	/// Potentially many "websocket" connections to client
	server_bridges: ServerMultiplexer,
	// the cli arguments used to start the code server
	code_server_args: CodeServerArgs,
	/// port forwarding functionality
	port_forwarding: Option<PortForwarding>,
	/// install platform for the VS Code server
	platform: Platform,
	/// http client to make download/update requests
	http: Arc<FallbackSimpleHttp>,
	/// requests being served by the client
	http_requests: HttpRequestsMap,
}

/// Handler auth state.
enum AuthState {
	/// Auth is required, we're waiting for the client to send its challenge optionally bearing a token.
	WaitingForChallenge(Option<String>),
	/// A challenge has been issued. Waiting for a verification.
	ChallengeIssued(String),
	/// Auth is no longer required.
	Authenticated,
}

static MESSAGE_ID_COUNTER: AtomicU32 = AtomicU32::new(0);

// Gets a next incrementing number that can be used in logs
pub fn next_message_id() -> u32 {
	MESSAGE_ID_COUNTER.fetch_add(1, Ordering::SeqCst)
}

impl HandlerContext {
	async fn dispose(&self) {
		self.server_bridges.dispose().await;
		info!(self.log, "Disposed of connection to running server.");
	}
}

enum ServerSignal {
	/// Signalled when the server has been updated and we want to respawn.
	/// We'd generally need to stop and then restart the launcher, but the
	/// program might be managed by a supervisor like systemd. Instead, we
	/// will stop the TCP listener and spawn the launcher again as a subprocess
	/// with the same arguments we used.
	Respawn,
}

pub enum Next {
	/// Whether the server should be respawned in a new binary (see ServerSignal.Respawn).
	Respawn,
	/// Whether the tunnel should be restarted
	Restart,
	/// Whether the process should exit
	Exit,
}

pub struct ServerTermination {
	pub next: Next,
	pub tunnel: ActiveTunnel,
}

async fn preload_extensions(
	log: &log::Logger,
	platform: Platform,
	mut args: CodeServerArgs,
	launcher_paths: LauncherPaths,
) -> Result<(), AnyError> {
	args.start_server = false;

	let params_raw = ServerParamsRaw {
		commit_id: None,
		quality: Quality::Stable,
		code_server_args: args.clone(),
		headless: true,
		platform,
	};

	// cannot use delegated HTTP here since there's no remote connection yet
	let http = Arc::new(ReqwestSimpleHttp::new());
	let resolved = params_raw.resolve(log, http.clone()).await?;
	let sb = ServerBuilder::new(log, &resolved, &launcher_paths, http.clone());

	sb.setup().await?;
	sb.install_extensions().await
}

// Runs the launcher server. Exits on a ctrl+c or when requested by a user.
// Note that client connections may not be closed when this returns; use
// `close_all_clients()` on the ServerTermination to make this happen.
pub async fn serve(
	log: &log::Logger,
	mut tunnel: ActiveTunnel,
	launcher_paths: &LauncherPaths,
	code_server_args: &CodeServerArgs,
	platform: Platform,
	mut shutdown_rx: Barrier<ShutdownSignal>,
) -> Result<ServerTermination, AnyError> {
	let mut port = tunnel.add_port_direct(CONTROL_PORT).await?;
	let mut forwarding = PortForwardingProcessor::new();
	let (tx, mut rx) = mpsc::channel::<ServerSignal>(4);
	let (exit_barrier, signal_exit) = new_barrier();

	if !code_server_args.install_extensions.is_empty() {
		info!(
			log,
			"Preloading extensions using stable server: {:?}", code_server_args.install_extensions
		);
		let log = log.clone();
		let code_server_args = code_server_args.clone();
		let launcher_paths = launcher_paths.clone();
		// This is run async to the primary tunnel setup to be speedy.
		tokio::spawn(async move {
			if let Err(e) =
				preload_extensions(&log, platform, code_server_args, launcher_paths).await
			{
				warning!(log, "Failed to preload extensions: {:?}", e);
			} else {
				info!(log, "Extension install complete");
			}
		});
	}

	loop {
		tokio::select! {
			Ok(reason) = shutdown_rx.wait() => {
				info!(log, "Shutting down: {}", reason);
				drop(signal_exit);
				return Ok(ServerTermination {
					next: match reason {
						ShutdownSignal::RpcRestartRequested => Next::Restart,
						_ => Next::Exit,
					},
					tunnel,
				});
			},
			c = rx.recv() => {
				if let Some(ServerSignal::Respawn) = c {
					drop(signal_exit);
					return Ok(ServerTermination {
						next: Next::Respawn,
						tunnel,
					});
				}
			},
			Some(w) = forwarding.recv() => {
				forwarding.process(w, &mut tunnel).await;
			},
			l = port.recv() => {
				let socket = match l {
					Some(p) => p,
					None => {
						warning!(log, "ssh tunnel disposed, tearing down");
						return Ok(ServerTermination {
							next: Next::Restart,
							tunnel,
						});
					}
				};

				let own_log = log.prefixed(&log::new_rpc_prefix());
				let own_tx = tx.clone();
				let own_paths = launcher_paths.clone();
				let own_exit = exit_barrier.clone();
				let own_code_server_args = code_server_args.clone();
				let own_forwarding = forwarding.handle();

				tokio::spawn(async move {
					use opentelemetry::trace::{FutureExt, TraceContextExt};

					let span = own_log.span("server.socket").with_kind(SpanKind::Consumer).start(own_log.tracer());
					let cx = opentelemetry::Context::current_with_span(span);
					let serve_at = Instant::now();

					debug!(own_log, "Serving new connection");

					let (writehalf, readhalf) = socket.into_split();
					let stats = process_socket(readhalf, writehalf, own_tx, Some(own_forwarding), ServeStreamParams {
						log: own_log,
						launcher_paths: own_paths,
						code_server_args: own_code_server_args,
						platform,
						exit_barrier: own_exit,
						requires_auth: AuthRequired::None,
					}).with_context(cx.clone()).await;

					cx.span().add_event(
						"socket.bandwidth",
						vec![
							KeyValue::new("tx", stats.tx as f64),
							KeyValue::new("rx", stats.rx as f64),
							KeyValue::new("duration_ms", serve_at.elapsed().as_millis() as f64),
						],
					);
					cx.span().end();
				});
			}
		}
	}
}

#[derive(Clone)]
pub enum AuthRequired {
	None,
	VSDA,
	VSDAWithToken(String),
}

#[derive(Clone)]
pub struct ServeStreamParams {
	pub log: log::Logger,
	pub launcher_paths: LauncherPaths,
	pub code_server_args: CodeServerArgs,
	pub platform: Platform,
	pub requires_auth: AuthRequired,
	pub exit_barrier: Barrier<ShutdownSignal>,
}

pub async fn serve_stream(
	readhalf: impl AsyncRead + Send + Unpin + 'static,
	writehalf: impl AsyncWrite + Unpin,
	params: ServeStreamParams,
) -> SocketStats {
	// Currently the only server signal is respawn, that doesn't have much meaning
	// when serving a stream, so make an ignored channel.
	let (server_rx, server_tx) = mpsc::channel(1);
	drop(server_tx);

	process_socket(readhalf, writehalf, server_rx, None, params).await
}

pub struct SocketStats {
	rx: usize,
	tx: usize,
}

#[allow(clippy::too_many_arguments)]
fn make_socket_rpc(
	log: log::Logger,
	socket_tx: mpsc::Sender<SocketSignal>,
	http_delegated: DelegatedSimpleHttp,
	launcher_paths: LauncherPaths,
	code_server_args: CodeServerArgs,
	port_forwarding: Option<PortForwarding>,
	requires_auth: AuthRequired,
	platform: Platform,
	http_requests: HttpRequestsMap,
) -> RpcDispatcher<MsgPackSerializer, HandlerContext> {
	let server_bridges = ServerMultiplexer::new();
	let mut rpc = RpcBuilder::new(MsgPackSerializer {}).methods(HandlerContext {
		did_update: Arc::new(AtomicBool::new(false)),
		auth_state: Arc::new(std::sync::Mutex::new(match requires_auth {
			AuthRequired::VSDAWithToken(t) => AuthState::WaitingForChallenge(Some(t)),
			AuthRequired::VSDA => AuthState::WaitingForChallenge(None),
			AuthRequired::None => AuthState::Authenticated,
		})),
		socket_tx,
		log: log.clone(),
		launcher_paths,
		code_server_args,
		code_server: Arc::new(Mutex::new(None)),
		server_bridges,
		port_forwarding,
		platform,
		http: Arc::new(FallbackSimpleHttp::new(
			ReqwestSimpleHttp::new(),
			http_delegated,
		)),
		http_requests,
	});

	rpc.register_sync("ping", |_: EmptyObject, _| Ok(EmptyObject {}));
	rpc.register_sync("gethostname", |_: EmptyObject, _| handle_get_hostname());
	rpc.register_sync("sys_kill", |p: SysKillRequest, c| {
		ensure_auth(&c.auth_state)?;
		handle_sys_kill(p.pid)
	});
	rpc.register_sync("fs_stat", |p: FsSinglePathRequest, c| {
		ensure_auth(&c.auth_state)?;
		handle_stat(p.path)
	});
	rpc.register_duplex(
		"fs_read",
		1,
		move |mut streams, p: FsSinglePathRequest, c| async move {
			ensure_auth(&c.auth_state)?;
			handle_fs_read(streams.remove(0), p.path).await
		},
	);
	rpc.register_duplex(
		"fs_write",
		1,
		move |mut streams, p: FsSinglePathRequest, c| async move {
			ensure_auth(&c.auth_state)?;
			handle_fs_write(streams.remove(0), p.path).await
		},
	);
	rpc.register_duplex(
		"fs_connect",
		1,
		move |mut streams, p: FsSinglePathRequest, c| async move {
			ensure_auth(&c.auth_state)?;
			handle_fs_connect(streams.remove(0), p.path).await
		},
	);
	rpc.register_duplex(
		"net_connect",
		1,
		move |mut streams, n: NetConnectRequest, c| async move {
			ensure_auth(&c.auth_state)?;
			handle_net_connect(streams.remove(0), n).await
		},
	);
	rpc.register_async("fs_rm", move |p: FsSinglePathRequest, c| async move {
		ensure_auth(&c.auth_state)?;
		handle_fs_remove(p.path).await
	});
	rpc.register_sync("fs_mkdirp", |p: FsSinglePathRequest, c| {
		ensure_auth(&c.auth_state)?;
		handle_fs_mkdirp(p.path)
	});
	rpc.register_sync("fs_rename", |p: FsRenameRequest, c| {
		ensure_auth(&c.auth_state)?;
		handle_fs_rename(p.from_path, p.to_path)
	});
	rpc.register_sync("fs_readdir", |p: FsSinglePathRequest, c| {
		ensure_auth(&c.auth_state)?;
		handle_fs_readdir(p.path)
	});
	rpc.register_sync("get_env", |_: EmptyObject, c| {
		ensure_auth(&c.auth_state)?;
		handle_get_env()
	});
	rpc.register_sync(METHOD_CHALLENGE_ISSUE, |p: ChallengeIssueParams, c| {
		handle_challenge_issue(p, &c.auth_state)
	});
	rpc.register_sync(METHOD_CHALLENGE_VERIFY, |p: ChallengeVerifyParams, c| {
		handle_challenge_verify(p.response, &c.auth_state)
	});
	rpc.register_async("serve", move |params: ServeParams, c| async move {
		ensure_auth(&c.auth_state)?;
		handle_serve(c, params).await
	});
	rpc.register_async("update", |p: UpdateParams, c| async move {
		handle_update(&c.http, &c.log, &c.did_update, &p).await
	});
	rpc.register_sync("servermsg", |m: ServerMessageParams, c| {
		if let Err(e) = handle_server_message(&c.log, &c.server_bridges, m) {
			warning!(c.log, "error handling call: {:?}", e);
		}
		Ok(EmptyObject {})
	});
	rpc.register_sync("prune", |_: EmptyObject, c| handle_prune(&c.launcher_paths));
	rpc.register_async("callserverhttp", |p: CallServerHttpParams, c| async move {
		let code_server = c.code_server.lock().await.clone();
		handle_call_server_http(code_server, p).await
	});
	rpc.register_async("forward", |p: ForwardParams, c| async move {
		ensure_auth(&c.auth_state)?;
		handle_forward(&c.log, &c.port_forwarding, p).await
	});
	rpc.register_async("unforward", |p: UnforwardParams, c| async move {
		ensure_auth(&c.auth_state)?;
		handle_unforward(&c.log, &c.port_forwarding, p).await
	});
	rpc.register_async("acquire_cli", |p: AcquireCliParams, c| async move {
		ensure_auth(&c.auth_state)?;
		handle_acquire_cli(&c.launcher_paths, &c.http, &c.log, p).await
	});
	rpc.register_duplex("spawn", 3, |mut streams, p: SpawnParams, c| async move {
		ensure_auth(&c.auth_state)?;
		handle_spawn(
			&c.log,
			p,
			Some(streams.remove(0)),
			Some(streams.remove(0)),
			Some(streams.remove(0)),
		)
		.await
	});
	rpc.register_duplex(
		"spawn_cli",
		3,
		|mut streams, p: SpawnParams, c| async move {
			ensure_auth(&c.auth_state)?;
			handle_spawn_cli(
				&c.log,
				p,
				streams.remove(0),
				streams.remove(0),
				streams.remove(0),
			)
			.await
		},
	);
	rpc.register_sync("httpheaders", |p: HttpHeadersParams, c| {
		if let Some(req) = c.http_requests.lock().unwrap().get(&p.req_id) {
			trace!(c.log, "got {} response for req {}", p.status_code, p.req_id);
			req.initial_response(p.status_code, p.headers);
		} else {
			warning!(c.log, "got response for unknown req {}", p.req_id);
		}
		Ok(EmptyObject {})
	});
	rpc.register_sync("httpbody", move |p: HttpBodyParams, c| {
		let mut reqs = c.http_requests.lock().unwrap();
		if let Some(req) = reqs.get(&p.req_id) {
			if !p.segment.is_empty() {
				req.body(p.segment);
			}
			if p.complete {
				trace!(c.log, "delegated request {} completed", p.req_id);
				reqs.remove(&p.req_id);
			}
		}
		Ok(EmptyObject {})
	});
	rpc.register_sync(
		"version",
		|_: EmptyObject, _| Ok(VersionResponse::default()),
	);

	rpc.build(log)
}

fn ensure_auth(is_authed: &Arc<std::sync::Mutex<AuthState>>) -> Result<(), AnyError> {
	if let AuthState::Authenticated = &*is_authed.lock().unwrap() {
		Ok(())
	} else {
		Err(CodeError::ServerAuthRequired.into())
	}
}

#[allow(clippy::too_many_arguments)] // necessary here
async fn process_socket(
	readhalf: impl AsyncRead + Send + Unpin + 'static,
	mut writehalf: impl AsyncWrite + Unpin,
	server_tx: mpsc::Sender<ServerSignal>,
	port_forwarding: Option<PortForwarding>,
	params: ServeStreamParams,
) -> SocketStats {
	let ServeStreamParams {
		mut exit_barrier,
		log,
		launcher_paths,
		code_server_args,
		platform,
		requires_auth,
	} = params;

	let (http_delegated, mut http_rx) = DelegatedSimpleHttp::new(log.clone());
	let (socket_tx, mut socket_rx) = mpsc::channel(4);
	let rx_counter = Arc::new(AtomicUsize::new(0));
	let http_requests = Arc::new(std::sync::Mutex::new(HashMap::new()));

	let already_authed = matches!(requires_auth, AuthRequired::None);
	let rpc = make_socket_rpc(
		log.clone(),
		socket_tx.clone(),
		http_delegated,
		launcher_paths,
		code_server_args,
		port_forwarding,
		requires_auth,
		platform,
		http_requests.clone(),
	);

	{
		let log = log.clone();
		let rx_counter = rx_counter.clone();
		let socket_tx = socket_tx.clone();
		let exit_barrier = exit_barrier.clone();
		tokio::spawn(async move {
			if already_authed {
				send_version(&socket_tx).await;
			}

			if let Err(e) =
				handle_socket_read(&log, readhalf, exit_barrier, &socket_tx, rx_counter, &rpc).await
			{
				debug!(log, "closing socket reader: {}", e);
				socket_tx
					.send(SocketSignal::CloseWith(CloseReason(format!("{e}"))))
					.await
					.ok();
			}

			let ctx = rpc.context();

			// The connection is now closed, asked to respawn if needed
			if ctx.did_update.load(Ordering::SeqCst) {
				server_tx.send(ServerSignal::Respawn).await.ok();
			}

			ctx.dispose().await;

			let _ = socket_tx
				.send(SocketSignal::CloseWith(CloseReason("eof".to_string())))
				.await;
		});
	}

	let mut tx_counter = 0;

	loop {
		tokio::select! {
			_ = exit_barrier.wait() => {
				writehalf.shutdown().await.ok();
				break;
			},
			Some(r) = http_rx.recv() => {
				let id = next_message_id();
				let serialized = rmp_serde::to_vec_named(&ToClientRequest {
					id: None,
					params: ClientRequestMethod::makehttpreq(HttpRequestParams {
						url: &r.url,
						method: r.method,
						req_id: id,
					}),
				})
				.unwrap();

				http_requests.lock().unwrap().insert(id, r);

				tx_counter += serialized.len();
				if let Err(e) = writehalf.write_all(&serialized).await {
					debug!(log, "Closing connection: {}", e);
					break;
				}
			}
			recv = socket_rx.recv() => match recv {
				None => break,
				Some(message) => match message {
					SocketSignal::Send(bytes) => {
						tx_counter += bytes.len();
						if let Err(e) = writehalf.write_all(&bytes).await {
							debug!(log, "Closing connection: {}", e);
							break;
						}
					}
					SocketSignal::CloseWith(reason) => {
						debug!(log, "Closing connection: {}", reason.0);
						break;
					}
				}
			}
		}
	}

	SocketStats {
		tx: tx_counter,
		rx: rx_counter.load(Ordering::Acquire),
	}
}

async fn send_version(tx: &mpsc::Sender<SocketSignal>) {
	tx.send(SocketSignal::from_message(&ToClientRequest {
		id: None,
		params: ClientRequestMethod::version(VersionResponse::default()),
	}))
	.await
	.ok();
}
async fn handle_socket_read(
	_log: &log::Logger,
	readhalf: impl AsyncRead + Unpin,
	mut closer: Barrier<ShutdownSignal>,
	socket_tx: &mpsc::Sender<SocketSignal>,
	rx_counter: Arc<AtomicUsize>,
	rpc: &RpcDispatcher<MsgPackSerializer, HandlerContext>,
) -> Result<(), std::io::Error> {
	let mut readhalf = BufReader::new(readhalf);
	let mut decoder = MsgPackCodec::new();
	let mut decoder_buf = bytes::BytesMut::new();

	loop {
		let read_len = tokio::select! {
			r = readhalf.read_buf(&mut decoder_buf) => r,
			_ = closer.wait() => Err(std::io::Error::new(std::io::ErrorKind::UnexpectedEof, "eof")),
		}?;

		if read_len == 0 {
			return Ok(());
		}

		rx_counter.fetch_add(read_len, Ordering::Relaxed);

		while let Some(frame) = decoder.decode(&mut decoder_buf)? {
			match rpc.dispatch_with_partial(&frame.vec, frame.obj) {
				MaybeSync::Sync(Some(v)) => {
					if socket_tx.send(SocketSignal::Send(v)).await.is_err() {
						return Ok(());
					}
				}
				MaybeSync::Sync(None) => continue,
				MaybeSync::Future(fut) => {
					let socket_tx = socket_tx.clone();
					tokio::spawn(async move {
						if let Some(v) = fut.await {
							socket_tx.send(SocketSignal::Send(v)).await.ok();
						}
					});
				}
				MaybeSync::Stream((stream, fut)) => {
					if let Some(stream) = stream {
						rpc.register_stream(socket_tx.clone(), stream).await;
					}
					let socket_tx = socket_tx.clone();
					tokio::spawn(async move {
						if let Some(v) = fut.await {
							socket_tx.send(SocketSignal::Send(v)).await.ok();
						}
					});
				}
			}
		}
	}
}

#[derive(Clone)]
struct ServerOutputSink {
	tx: mpsc::Sender<SocketSignal>,
}

impl log::LogSink for ServerOutputSink {
	fn write_log(&self, level: log::Level, _prefix: &str, message: &str) {
		let s = SocketSignal::from_message(&ToClientRequest {
			id: None,
			params: ClientRequestMethod::serverlog(ServerLog {
				line: message,
				level: level.to_u8(),
			}),
		});

		self.tx.try_send(s).ok();
	}

	fn write_result(&self, _message: &str) {}
}

async fn handle_serve(
	c: Arc<HandlerContext>,
	params: ServeParams,
) -> Result<EmptyObject, AnyError> {
	// fill params.extensions into code_server_args.install_extensions
	let mut csa = c.code_server_args.clone();
	csa.connection_token = params.connection_token.or(csa.connection_token);
	csa.install_extensions.extend(params.extensions.into_iter());

	let params_raw = ServerParamsRaw {
		commit_id: params.commit_id,
		quality: params.quality,
		code_server_args: csa,
		headless: true,
		platform: c.platform,
	};

	let resolved = if params.use_local_download {
		params_raw
			.resolve(&c.log, Arc::new(c.http.delegated()))
			.await
	} else {
		params_raw.resolve(&c.log, c.http.clone()).await
	}?;

	let mut server_ref = c.code_server.lock().await;
	let server = match &*server_ref {
		Some(o) => o.clone(),
		None => {
			let install_log = c.log.tee(ServerOutputSink {
				tx: c.socket_tx.clone(),
			});

			macro_rules! do_setup {
				($sb:expr) => {
					match $sb.get_running().await? {
						Some(AnyCodeServer::Socket(s)) => ($sb, Ok(s)),
						Some(_) => return Err(AnyError::from(MismatchedLaunchModeError())),
						None => {
							$sb.setup().await?;
							let r = $sb.listen_on_default_socket().await;
							($sb, r)
						}
					}
				};
			}

			let (sb, server) = if params.use_local_download {
				let sb = ServerBuilder::new(
					&install_log,
					&resolved,
					&c.launcher_paths,
					Arc::new(c.http.delegated()),
				);
				do_setup!(sb)
			} else {
				let sb =
					ServerBuilder::new(&install_log, &resolved, &c.launcher_paths, c.http.clone());
				do_setup!(sb)
			};

			let server = match server {
				Ok(s) => s,
				Err(e) => {
					// we don't loop to avoid doing so infinitely: allow the client to reconnect in this case.
					if let AnyError::CodeError(CodeError::ServerUnexpectedExit(ref e)) = e {
						warning!(
							c.log,
							"({}), removing server due to possible corruptions",
							e
						);
						if let Err(e) = sb.evict().await {
							warning!(c.log, "Failed to evict server: {}", e);
						}
					}
					return Err(e);
				}
			};

			server_ref.replace(server.clone());
			server
		}
	};

	attach_server_bridge(
		&c.log,
		server,
		c.socket_tx.clone(),
		c.server_bridges.clone(),
		params.socket_id,
		params.compress,
	)
	.await?;
	Ok(EmptyObject {})
}

async fn attach_server_bridge(
	log: &log::Logger,
	code_server: SocketCodeServer,
	socket_tx: mpsc::Sender<SocketSignal>,
	multiplexer: ServerMultiplexer,
	socket_id: u16,
	compress: bool,
) -> Result<u16, AnyError> {
	let (server_messages, decoder) = if compress {
		(
			ServerMessageSink::new_compressed(
				multiplexer.clone(),
				socket_id,
				ServerMessageDestination::Channel(socket_tx),
			),
			ClientMessageDecoder::new_compressed(),
		)
	} else {
		(
			ServerMessageSink::new_plain(
				multiplexer.clone(),
				socket_id,
				ServerMessageDestination::Channel(socket_tx),
			),
			ClientMessageDecoder::new_plain(),
		)
	};

	let attached_fut = ServerBridge::new(&code_server.socket, server_messages, decoder).await;
	match attached_fut {
		Ok(a) => {
			multiplexer.register(socket_id, a);
			trace!(log, "Attached to server");
			Ok(socket_id)
		}
		Err(e) => Err(e),
	}
}

/// Handle an incoming server message. This is synchronous and uses a 'write loop'
/// to ensure message order is preserved exactly, which is necessary for compression.
fn handle_server_message(
	log: &log::Logger,
	multiplexer: &ServerMultiplexer,
	params: ServerMessageParams,
) -> Result<EmptyObject, AnyError> {
	if multiplexer.write_message(log, params.i, params.body) {
		Ok(EmptyObject {})
	} else {
		Err(AnyError::from(NoAttachedServerError()))
	}
}

fn handle_prune(paths: &LauncherPaths) -> Result<Vec<String>, AnyError> {
	prune_stopped_servers(paths).map(|v| {
		v.iter()
			.map(|p| p.server_dir.display().to_string())
			.collect()
	})
}

async fn handle_update(
	http: &Arc<FallbackSimpleHttp>,
	log: &log::Logger,
	did_update: &AtomicBool,
	params: &UpdateParams,
) -> Result<UpdateResult, AnyError> {
	if matches!(is_integrated_cli(), Ok(true)) || did_update.load(Ordering::SeqCst) {
		return Ok(UpdateResult {
			up_to_date: true,
			did_update: false,
		});
	}

	let update_service = UpdateService::new(log.clone(), http.clone());
	let updater = SelfUpdate::new(&update_service)?;
	let latest_release = updater.get_current_release().await?;
	let up_to_date = updater.is_up_to_date_with(&latest_release);

	let _ = updater.cleanup_old_update();

	if !params.do_update || up_to_date {
		return Ok(UpdateResult {
			up_to_date,
			did_update: false,
		});
	}

	if did_update
		.compare_exchange(false, true, Ordering::SeqCst, Ordering::SeqCst)
		.is_err()
	{
		return Ok(UpdateResult {
			up_to_date: true,
			did_update: true, // well, another thread did, but same difference...
		});
	}

	info!(log, "Updating CLI to {}", latest_release);

	let r = updater
		.do_update(&latest_release, SilentCopyProgress())
		.await;

	if let Err(e) = r {
		did_update.store(false, Ordering::SeqCst);
		return Err(e);
	}

	Ok(UpdateResult {
		up_to_date: true,
		did_update: true,
	})
}

fn handle_get_hostname() -> Result<GetHostnameResponse, AnyError> {
	Ok(GetHostnameResponse {
		value: gethostname::gethostname().to_string_lossy().into_owned(),
	})
}

fn handle_stat(path: String) -> Result<FsStatResponse, AnyError> {
	Ok(std::fs::metadata(path)
		.map(|m| FsStatResponse {
			exists: true,
			size: Some(m.len()),
			kind: Some(m.file_type().into()),
		})
		.unwrap_or_default())
}

async fn handle_fs_read(mut out: DuplexStream, path: String) -> Result<EmptyObject, AnyError> {
	let mut f = tokio::fs::File::open(path)
		.await
		.map_err(|e| wrap(e, "file not found"))?;

	tokio::io::copy(&mut f, &mut out)
		.await
		.map_err(|e| wrap(e, "error reading file"))?;

	Ok(EmptyObject {})
}

async fn handle_fs_write(mut input: DuplexStream, path: String) -> Result<EmptyObject, AnyError> {
	let mut f = tokio::fs::File::create(path)
		.await
		.map_err(|e| wrap(e, "file not found"))?;

	tokio::io::copy(&mut input, &mut f)
		.await
		.map_err(|e| wrap(e, "error writing file"))?;

	Ok(EmptyObject {})
}

async fn handle_net_connect(
	mut stream: DuplexStream,
	req: NetConnectRequest,
) -> Result<EmptyObject, AnyError> {
	let mut s = TcpStream::connect((req.host, req.port))
		.await
		.map_err(|e| wrap(e, "could not connect to address"))?;

	tokio::io::copy_bidirectional(&mut stream, &mut s)
		.await
		.map_err(|e| wrap(e, "error copying stream data"))?;

	Ok(EmptyObject {})
}
async fn handle_fs_connect(
	mut stream: DuplexStream,
	path: String,
) -> Result<EmptyObject, AnyError> {
	let mut s = get_socket_rw_stream(&PathBuf::from(path))
		.await
		.map_err(|e| wrap(e, "could not connect to socket"))?;

	tokio::io::copy_bidirectional(&mut stream, &mut s)
		.await
		.map_err(|e| wrap(e, "error copying stream data"))?;

	Ok(EmptyObject {})
}

async fn handle_fs_remove(path: String) -> Result<EmptyObject, AnyError> {
	tokio::fs::remove_dir_all(path)
		.await
		.map_err(|e| wrap(e, "error removing directory"))?;
	Ok(EmptyObject {})
}

fn handle_fs_rename(from_path: String, to_path: String) -> Result<EmptyObject, AnyError> {
	std::fs::rename(from_path, to_path).map_err(|e| wrap(e, "error renaming"))?;
	Ok(EmptyObject {})
}

fn handle_fs_mkdirp(path: String) -> Result<EmptyObject, AnyError> {
	std::fs::create_dir_all(path).map_err(|e| wrap(e, "error creating directory"))?;
	Ok(EmptyObject {})
}

fn handle_fs_readdir(path: String) -> Result<FsReadDirResponse, AnyError> {
	let mut entries = std::fs::read_dir(path).map_err(|e| wrap(e, "error listing directory"))?;

	let mut contents = Vec::new();
	while let Some(Ok(child)) = entries.next() {
		contents.push(FsReadDirEntry {
			name: child.file_name().to_string_lossy().into_owned(),
			kind: child.file_type().ok().map(|v| v.into()),
		});
	}

	Ok(FsReadDirResponse { contents })
}

fn handle_sys_kill(pid: u32) -> Result<SysKillResponse, AnyError> {
	Ok(SysKillResponse {
		success: kill_pid(pid),
	})
}

fn handle_get_env() -> Result<GetEnvResponse, AnyError> {
	Ok(GetEnvResponse {
		env: std::env::vars().collect(),
		os_release: os_release().unwrap_or_else(|_| "unknown".to_string()),
		#[cfg(windows)]
		os_platform: "win32",
		#[cfg(target_os = "linux")]
		os_platform: "linux",
		#[cfg(target_os = "macos")]
		os_platform: "darwin",
	})
}

fn handle_challenge_issue(
	params: ChallengeIssueParams,
	auth_state: &Arc<std::sync::Mutex<AuthState>>,
) -> Result<ChallengeIssueResponse, AnyError> {
	let challenge = create_challenge();

	let mut auth_state = auth_state.lock().unwrap();
	if let AuthState::WaitingForChallenge(Some(s)) = &*auth_state {
		match &params.token {
			Some(t) if s != t => return Err(CodeError::AuthChallengeBadToken.into()),
			None => return Err(CodeError::AuthChallengeBadToken.into()),
			_ => {}
		}
	}

	*auth_state = AuthState::ChallengeIssued(challenge.clone());
	Ok(ChallengeIssueResponse { challenge })
}

fn handle_challenge_verify(
	response: String,
	auth_state: &Arc<std::sync::Mutex<AuthState>>,
) -> Result<EmptyObject, AnyError> {
	let mut auth_state = auth_state.lock().unwrap();

	match &*auth_state {
		AuthState::Authenticated => Ok(EmptyObject {}),
		AuthState::WaitingForChallenge(_) => Err(CodeError::AuthChallengeNotIssued.into()),
		AuthState::ChallengeIssued(c) => match verify_challenge(c, &response) {
			false => Err(CodeError::AuthChallengeNotIssued.into()),
			true => {
				*auth_state = AuthState::Authenticated;
				Ok(EmptyObject {})
			}
		},
	}
}

async fn handle_forward(
	log: &log::Logger,
	port_forwarding: &Option<PortForwarding>,
	params: ForwardParams,
) -> Result<ForwardResult, AnyError> {
	let port_forwarding = port_forwarding
		.as_ref()
		.ok_or(CodeError::PortForwardingNotAvailable)?;
	info!(
		log,
		"Forwarding port {} (public={})", params.port, params.public
	);
	let privacy = match params.public {
		true => PortPrivacy::Public,
		false => PortPrivacy::Private,
	};

	let uri = port_forwarding.forward(params.port, privacy).await?;
	Ok(ForwardResult { uri })
}

async fn handle_unforward(
	log: &log::Logger,
	port_forwarding: &Option<PortForwarding>,
	params: UnforwardParams,
) -> Result<EmptyObject, AnyError> {
	let port_forwarding = port_forwarding
		.as_ref()
		.ok_or(CodeError::PortForwardingNotAvailable)?;
	info!(log, "Unforwarding port {}", params.port);
	port_forwarding.unforward(params.port).await?;
	Ok(EmptyObject {})
}

async fn handle_call_server_http(
	code_server: Option<SocketCodeServer>,
	params: CallServerHttpParams,
) -> Result<CallServerHttpResult, AnyError> {
	use hyper::{body, client::conn::Builder, Body, Request};

	// We use Hyper directly here since reqwest doesn't support sockets/pipes.
	// See https://github.com/seanmonstar/reqwest/issues/39

	let socket = match &code_server {
		Some(cs) => &cs.socket,
		None => return Err(AnyError::from(NoAttachedServerError())),
	};

	let rw = get_socket_rw_stream(socket).await?;

	let (mut request_sender, connection) = Builder::new()
		.handshake(rw)
		.await
		.map_err(|e| wrap(e, "error establishing connection"))?;

	// start the connection processing; it's shut down when the sender is dropped
	tokio::spawn(connection);

	let mut request_builder = Request::builder()
		.method::<&str>(params.method.as_ref())
		.uri(format!("http://127.0.0.1{}", params.path))
		.header("Host", "127.0.0.1");

	for (k, v) in params.headers {
		request_builder = request_builder.header(k, v);
	}
	let request = request_builder
		.body(Body::from(params.body.unwrap_or_default()))
		.map_err(|e| wrap(e, "invalid request"))?;

	let response = request_sender
		.send_request(request)
		.await
		.map_err(|e| wrap(e, "error sending request"))?;

	Ok(CallServerHttpResult {
		status: response.status().as_u16(),
		headers: response
			.headers()
			.into_iter()
			.map(|(k, v)| (k.to_string(), v.to_str().unwrap_or("").to_string()))
			.collect(),
		body: body::to_bytes(response)
			.await
			.map_err(|e| wrap(e, "error reading response body"))?
			.to_vec(),
	})
}

async fn handle_acquire_cli(
	paths: &LauncherPaths,
	http: &Arc<FallbackSimpleHttp>,
	log: &log::Logger,
	params: AcquireCliParams,
) -> Result<SpawnResult, AnyError> {
	let update_service = UpdateService::new(log.clone(), http.clone());

	let release = match params.commit_id {
		Some(commit) => Release {
			name: format!("{PRODUCT_NAME_LONG} CLI"),
			commit,
			platform: params.platform,
			quality: params.quality,
			target: TargetKind::Cli,
		},
		None => {
			update_service
				.get_latest_commit(params.platform, TargetKind::Cli, params.quality)
				.await?
		}
	};

	let cli = download_cli_into_cache(&paths.cli_cache, &release, &update_service).await?;
	let file = tokio::fs::File::open(cli)
		.await
		.map_err(|e| wrap(e, "error opening cli file"))?;

	handle_spawn::<_, DuplexStream>(log, params.spawn, Some(file), None, None).await
}

async fn handle_spawn<Stdin, StdoutAndErr>(
	log: &log::Logger,
	params: SpawnParams,
	stdin: Option<Stdin>,
	stdout: Option<StdoutAndErr>,
	stderr: Option<StdoutAndErr>,
) -> Result<SpawnResult, AnyError>
where
	Stdin: AsyncRead + Unpin + Send + 'static,
	StdoutAndErr: AsyncWrite + Unpin + Send + 'static,
{
	debug!(
		log,
		"requested to spawn {} with args {:?}", params.command, params.args
	);

	macro_rules! pipe_if {
		($e: expr) => {
			if $e {
				Stdio::piped()
			} else {
				Stdio::null()
			}
		};
	}

	let mut p = new_tokio_command(&params.command);
	p.args(&params.args);
	p.envs(&params.env);
	p.stdin(pipe_if!(stdin.is_some()));
	p.stdout(pipe_if!(stdin.is_some()));
	p.stderr(pipe_if!(stderr.is_some()));
	if let Some(cwd) = &params.cwd {
		p.current_dir(cwd);
	}

	#[cfg(target_os = "windows")]
	p.creation_flags(winapi::um::winbase::CREATE_NO_WINDOW);

	let mut p = p.spawn().map_err(CodeError::ProcessSpawnFailed)?;

	let block_futs = FuturesUnordered::new();
	let poll_futs = FuturesUnordered::new();
	if let (Some(mut a), Some(mut b)) = (p.stdout.take(), stdout) {
		block_futs.push(async move { tokio::io::copy(&mut a, &mut b).await }.boxed());
	}
	if let (Some(mut a), Some(mut b)) = (p.stderr.take(), stderr) {
		block_futs.push(async move { tokio::io::copy(&mut a, &mut b).await }.boxed());
	}
	if let (Some(mut b), Some(mut a)) = (p.stdin.take(), stdin) {
		poll_futs.push(async move { tokio::io::copy(&mut a, &mut b).await }.boxed());
	}

	wait_for_process_exit(log, &params.command, p, block_futs, poll_futs).await
}

async fn handle_spawn_cli(
	log: &log::Logger,
	params: SpawnParams,
	mut protocol_in: DuplexStream,
	mut protocol_out: DuplexStream,
	mut log_out: DuplexStream,
) -> Result<SpawnResult, AnyError> {
	debug!(
		log,
		"requested to spawn cli {} with args {:?}", params.command, params.args
	);

	let mut p = new_tokio_command(&params.command);
	p.args(&params.args);

	// CLI args to spawn a server; contracted with clients that they should _not_ provide these.
	p.arg("--verbose");
	p.arg("command-shell");

	p.envs(&params.env);
	p.stdin(Stdio::piped());
	p.stdout(Stdio::piped());
	p.stderr(Stdio::piped());
	if let Some(cwd) = &params.cwd {
		p.current_dir(cwd);
	}

	let mut p = p.spawn().map_err(CodeError::ProcessSpawnFailed)?;

	let mut stdin = p.stdin.take().unwrap();
	let mut stdout = p.stdout.take().unwrap();
	let mut stderr = p.stderr.take().unwrap();

	// Start handling logs while doing the handshake in case there's some kind of error
	let log_pump = tokio::spawn(async move { tokio::io::copy(&mut stdout, &mut log_out).await });

	// note: intentionally do not wrap stdin in a bufreader, since we don't
	// want to read anything other than our handshake messages.
	if let Err(e) = spawn_do_child_authentication(log, &mut stdin, &mut stderr).await {
		warning!(log, "failed to authenticate with child process {}", e);
		let _ = p.kill().await;
		return Err(e.into());
	}

	debug!(log, "cli authenticated, attaching stdio");
	let block_futs = FuturesUnordered::new();
	let poll_futs = FuturesUnordered::new();
	poll_futs.push(async move { tokio::io::copy(&mut protocol_in, &mut stdin).await }.boxed());
	block_futs.push(async move { tokio::io::copy(&mut stderr, &mut protocol_out).await }.boxed());
	block_futs.push(async move { log_pump.await.unwrap() }.boxed());

	wait_for_process_exit(log, &params.command, p, block_futs, poll_futs).await
}

type TokioCopyFuture = dyn futures::Future<Output = Result<u64, std::io::Error>> + Send;

async fn get_joined_result(
	mut process: tokio::process::Child,
	block_futs: FuturesUnordered<std::pin::Pin<Box<TokioCopyFuture>>>,
) -> Result<std::process::ExitStatus, std::io::Error> {
	let (_, r) = tokio::join!(futures::future::join_all(block_futs), process.wait());
	r
}

/// Wait for the process to exit and sends the spawn result. Waits until the
/// `block_futs` and the process have exited, and polls the `poll_futs` while
/// doing so.
async fn wait_for_process_exit(
	log: &log::Logger,
	command: &str,
	process: tokio::process::Child,
	block_futs: FuturesUnordered<std::pin::Pin<Box<TokioCopyFuture>>>,
	poll_futs: FuturesUnordered<std::pin::Pin<Box<TokioCopyFuture>>>,
) -> Result<SpawnResult, AnyError> {
	let joined = get_joined_result(process, block_futs);
	pin!(joined);

	let r = tokio::select! {
		_ = futures::future::join_all(poll_futs) => joined.await,
		r = &mut joined => r,
	};

	let r = match r {
		Ok(e) => SpawnResult {
			message: e.to_string(),
			exit_code: e.code().unwrap_or(-1),
		},
		Err(e) => SpawnResult {
			message: e.to_string(),
			exit_code: -1,
		},
	};

	debug!(
		log,
		"spawned cli {} exited with code {}", command, r.exit_code
	);

	Ok(r)
}

async fn spawn_do_child_authentication(
	log: &log::Logger,
	stdin: &mut ChildStdin,
	stdout: &mut ChildStderr,
) -> Result<(), CodeError> {
	let (msg_tx, msg_rx) = mpsc::unbounded_channel();
	let (shutdown_rx, shutdown) = new_barrier();
	let mut rpc = new_msgpack_rpc();
	let caller = rpc.get_caller(msg_tx);

	let challenge_response = do_challenge_response_flow(caller, shutdown);
	let rpc = start_msgpack_rpc(
		rpc.methods(()).build(log.prefixed("client-auth")),
		stdout,
		stdin,
		msg_rx,
		shutdown_rx,
	);
	pin!(rpc);

	tokio::select! {
		r = &mut rpc => {
			match r {
				// means shutdown happened cleanly already, we're good
				Ok(_) => Ok(()),
				Err(e) => Err(CodeError::ProcessSpawnHandshakeFailed(e))
			}
		},
		r = challenge_response => {
			r?;
			rpc.await.map(|_| ()).map_err(CodeError::ProcessSpawnFailed)
		}
	}
}

async fn do_challenge_response_flow(
	caller: RpcCaller<MsgPackSerializer>,
	shutdown: BarrierOpener<()>,
) -> Result<(), CodeError> {
	let challenge: ChallengeIssueResponse = caller
		.call(METHOD_CHALLENGE_ISSUE, EmptyObject {})
		.await
		.unwrap()
		.map_err(CodeError::TunnelRpcCallFailed)?;

	let _: EmptyObject = caller
		.call(
			METHOD_CHALLENGE_VERIFY,
			ChallengeVerifyParams {
				response: sign_challenge(&challenge.challenge),
			},
		)
		.await
		.unwrap()
		.map_err(CodeError::TunnelRpcCallFailed)?;

	shutdown.open(());

	Ok(())
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/tunnels/dev_tunnels.rs]---
Location: vscode-main/cli/src/tunnels/dev_tunnels.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
use super::protocol::{self, PortPrivacy, PortProtocol};
use crate::auth;
use crate::constants::{IS_INTERACTIVE_CLI, PROTOCOL_VERSION_TAG, TUNNEL_SERVICE_USER_AGENT};
use crate::state::{LauncherPaths, PersistedState};
use crate::util::errors::{
	wrap, AnyError, CodeError, DevTunnelError, InvalidTunnelName, TunnelCreationFailed,
	WrappedError,
};
use crate::util::input::prompt_placeholder;
use crate::{debug, info, log, spanf, trace, warning};
use async_trait::async_trait;
use futures::future::BoxFuture;
use futures::{FutureExt, TryFutureExt};
use lazy_static::lazy_static;
use rand::prelude::IteratorRandom;
use regex::Regex;
use reqwest::StatusCode;
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use std::time::Duration;
use tokio::sync::{mpsc, watch};
use tunnels::connections::{ForwardedPortConnection, RelayTunnelHost};
use tunnels::contracts::{
	Tunnel, TunnelAccessControl, TunnelPort, TunnelRelayTunnelEndpoint, PORT_TOKEN,
	TUNNEL_ACCESS_SCOPES_CONNECT, TUNNEL_PROTOCOL_AUTO,
};
use tunnels::management::{
	new_tunnel_management, HttpError, TunnelLocator, TunnelManagementClient, TunnelRequestOptions,
	NO_REQUEST_OPTIONS,
};

static TUNNEL_COUNT_LIMIT_NAME: &str = "TunnelsPerUserPerLocation";

#[allow(dead_code)]
mod tunnel_flags {
	use crate::{log, tunnels::wsl_detect::is_wsl_installed};

	pub const IS_WSL_INSTALLED: u32 = 1 << 0;
	pub const IS_WINDOWS: u32 = 1 << 1;
	pub const IS_LINUX: u32 = 1 << 2;
	pub const IS_MACOS: u32 = 1 << 3;

	/// Creates a flag string for the tunnel
	pub fn create(log: &log::Logger) -> String {
		let mut flags = 0;

		#[cfg(windows)]
		{
			flags |= IS_WINDOWS;
		}
		#[cfg(target_os = "linux")]
		{
			flags |= IS_LINUX;
		}
		#[cfg(target_os = "macos")]
		{
			flags |= IS_MACOS;
		}

		if is_wsl_installed(log) {
			flags |= IS_WSL_INSTALLED;
		}

		format!("_flag{flags}")
	}
}

#[derive(Clone, Serialize, Deserialize)]
pub struct PersistedTunnel {
	pub name: String,
	pub id: String,
	pub cluster: String,
}

impl PersistedTunnel {
	pub fn into_locator(self) -> TunnelLocator {
		TunnelLocator::ID {
			cluster: self.cluster,
			id: self.id,
		}
	}
	pub fn locator(&self) -> TunnelLocator {
		TunnelLocator::ID {
			cluster: self.cluster.clone(),
			id: self.id.clone(),
		}
	}
}

#[async_trait]
trait AccessTokenProvider: Send + Sync {
	/// Gets the current access token.
	async fn refresh_token(&self) -> Result<String, WrappedError>;

	/// Maintains the stored credential by refreshing it against the service
	/// to ensure its stays current. Returns a future that should be polled and
	/// only completes if a refresh fails in a consistent way.
	fn keep_alive(&self) -> BoxFuture<'static, Result<(), AnyError>>;
}

/// Access token provider that provides a fixed token without refreshing.
struct StaticAccessTokenProvider(String);

impl StaticAccessTokenProvider {
	pub fn new(token: String) -> Self {
		Self(token)
	}
}

#[async_trait]
impl AccessTokenProvider for StaticAccessTokenProvider {
	async fn refresh_token(&self) -> Result<String, WrappedError> {
		Ok(self.0.clone())
	}

	fn keep_alive(&self) -> BoxFuture<'static, Result<(), AnyError>> {
		futures::future::pending().boxed()
	}
}

/// Access token provider that looks up the token from the tunnels API.
struct LookupAccessTokenProvider {
	auth: auth::Auth,
	client: TunnelManagementClient,
	locator: TunnelLocator,
	log: log::Logger,
	initial_token: Arc<Mutex<Option<String>>>,
}

impl LookupAccessTokenProvider {
	pub fn new(
		auth: auth::Auth,
		client: TunnelManagementClient,
		locator: TunnelLocator,
		log: log::Logger,
		initial_token: Option<String>,
	) -> Self {
		Self {
			auth,
			client,
			locator,
			log,
			initial_token: Arc::new(Mutex::new(initial_token)),
		}
	}
}

#[async_trait]
impl AccessTokenProvider for LookupAccessTokenProvider {
	async fn refresh_token(&self) -> Result<String, WrappedError> {
		if let Some(token) = self.initial_token.lock().unwrap().take() {
			return Ok(token);
		}

		let tunnel_lookup = spanf!(
			self.log,
			self.log.span("dev-tunnel.tag.get"),
			self.client.get_tunnel(
				&self.locator,
				&TunnelRequestOptions {
					token_scopes: vec!["host".to_string()],
					..Default::default()
				}
			)
		);

		trace!(self.log, "Successfully refreshed access token");

		match tunnel_lookup {
			Ok(tunnel) => Ok(get_host_token_from_tunnel(&tunnel)),
			Err(e) => Err(wrap(e, "failed to lookup tunnel for host token")),
		}
	}

	fn keep_alive(&self) -> BoxFuture<'static, Result<(), AnyError>> {
		let auth = self.auth.clone();
		auth.keep_token_alive().boxed()
	}
}

#[derive(Clone)]
pub struct DevTunnels {
	auth: auth::Auth,
	log: log::Logger,
	launcher_tunnel: PersistedState<Option<PersistedTunnel>>,
	client: TunnelManagementClient,
	tag: &'static str,
}

/// Representation of a tunnel returned from the `start` methods.
pub struct ActiveTunnel {
	/// Name of the tunnel
	pub name: String,
	/// Underlying dev tunnels ID
	pub id: String,
	manager: ActiveTunnelManager,
}

impl ActiveTunnel {
	/// Closes and unregisters the tunnel.
	pub async fn close(&mut self) -> Result<(), AnyError> {
		self.manager.kill().await?;
		Ok(())
	}

	/// Forwards a port to local connections.
	pub async fn add_port_direct(
		&mut self,
		port_number: u16,
	) -> Result<mpsc::UnboundedReceiver<ForwardedPortConnection>, AnyError> {
		let port = self.manager.add_port_direct(port_number).await?;
		Ok(port)
	}

	/// Forwards a port over TCP.
	pub async fn add_port_tcp(
		&self,
		port_number: u16,
		privacy: PortPrivacy,
		protocol: PortProtocol,
	) -> Result<(), AnyError> {
		self.manager
			.add_port_tcp(port_number, privacy, protocol)
			.await?;
		Ok(())
	}

	/// Removes a forwarded port TCP.
	pub async fn remove_port(&self, port_number: u16) -> Result<(), AnyError> {
		self.manager.remove_port(port_number).await?;
		Ok(())
	}

	/// Gets the template string for forming forwarded port web URIs..
	pub fn get_port_format(&self) -> Result<String, AnyError> {
		if let Some(details) = &*self.manager.endpoint_rx.borrow() {
			return details
				.as_ref()
				.map(|r| {
					r.base
						.port_uri_format
						.clone()
						.expect("expected to have port format")
				})
				.map_err(|e| e.clone().into());
		}

		Err(CodeError::NoTunnelEndpoint.into())
	}

	/// Gets the public URI on which a forwarded port can be access in browser.
	pub fn get_port_uri(&self, port: u16) -> Result<String, AnyError> {
		self.get_port_format()
			.map(|f| f.replace(PORT_TOKEN, &port.to_string()))
	}

	/// Gets an object to read the current tunnel status.
	pub fn status(&self) -> StatusLock {
		self.manager.get_status()
	}
}

const VSCODE_CLI_TUNNEL_TAG: &str = "vscode-server-launcher";
const VSCODE_CLI_FORWARDING_TAG: &str = "vscode-port-forward";
const OWNED_TUNNEL_TAGS: &[&str] = &[VSCODE_CLI_TUNNEL_TAG, VSCODE_CLI_FORWARDING_TAG];
const MAX_TUNNEL_NAME_LENGTH: usize = 20;

fn get_host_token_from_tunnel(tunnel: &Tunnel) -> String {
	tunnel
		.access_tokens
		.as_ref()
		.expect("expected to have access tokens")
		.get("host")
		.expect("expected to have host token")
		.to_string()
}

fn is_valid_name(name: &str) -> Result<(), InvalidTunnelName> {
	if name.len() > MAX_TUNNEL_NAME_LENGTH {
		return Err(InvalidTunnelName(format!(
			"Names cannot be longer than {MAX_TUNNEL_NAME_LENGTH} characters. Please try a different name."
		)));
	}

	let re = Regex::new(r"^([\w-]+)$").unwrap();

	if !re.is_match(name) {
		return Err(InvalidTunnelName(
            "Names can only contain letters, numbers, and '-'. Spaces, commas, and all other special characters are not allowed. Please try a different name.".to_string()
        ));
	}

	Ok(())
}

lazy_static! {
	static ref HOST_TUNNEL_REQUEST_OPTIONS: TunnelRequestOptions = TunnelRequestOptions {
		include_ports: true,
		token_scopes: vec!["host".to_string()],
		..Default::default()
	};
}

/// Structure optionally passed into `start_existing_tunnel` to forward an existing tunnel.
#[derive(Clone, Debug)]
pub struct ExistingTunnel {
	/// Name you'd like to assign preexisting tunnel to use to connect to the VS Code Server
	pub tunnel_name: Option<String>,

	/// Token to authenticate and use preexisting tunnel
	pub host_token: String,

	/// Id of preexisting tunnel to use to connect to the VS Code Server
	pub tunnel_id: String,

	/// Cluster of preexisting tunnel to use to connect to the VS Code Server
	pub cluster: String,
}

impl DevTunnels {
	/// Creates a new DevTunnels client used for port forwarding.
	pub fn new_port_forwarding(
		log: &log::Logger,
		auth: auth::Auth,
		paths: &LauncherPaths,
	) -> DevTunnels {
		let mut client = new_tunnel_management(&TUNNEL_SERVICE_USER_AGENT);
		client.authorization_provider(auth.clone());

		DevTunnels {
			auth,
			log: log.clone(),
			client: client.into(),
			launcher_tunnel: PersistedState::new(paths.root().join("port_forwarding_tunnel.json")),
			tag: VSCODE_CLI_FORWARDING_TAG,
		}
	}

	/// Creates a new DevTunnels client used for the Remote Tunnels extension to access the VS Code Server.
	pub fn new_remote_tunnel(
		log: &log::Logger,
		auth: auth::Auth,
		paths: &LauncherPaths,
	) -> DevTunnels {
		let mut client = new_tunnel_management(&TUNNEL_SERVICE_USER_AGENT);
		client.authorization_provider(auth.clone());

		DevTunnels {
			auth,
			log: log.clone(),
			client: client.into(),
			launcher_tunnel: PersistedState::new(paths.root().join("code_tunnel.json")),
			tag: VSCODE_CLI_TUNNEL_TAG,
		}
	}

	pub async fn remove_tunnel(&mut self) -> Result<(), AnyError> {
		let tunnel = match self.launcher_tunnel.load() {
			Some(t) => t,
			None => {
				return Ok(());
			}
		};

		spanf!(
			self.log,
			self.log.span("dev-tunnel.delete"),
			self.client
				.delete_tunnel(&tunnel.into_locator(), NO_REQUEST_OPTIONS)
		)
		.map_err(|e| wrap(e, "failed to execute `tunnel delete`"))?;

		self.launcher_tunnel.save(None)?;
		Ok(())
	}

	/// Renames the current tunnel to the new name.
	pub async fn rename_tunnel(&mut self, name: &str) -> Result<(), AnyError> {
		self.update_tunnel_name(self.launcher_tunnel.load(), name)
			.await
			.map(|_| ())
	}

	/// Updates the name of the existing persisted tunnel to the new name.
	/// Gracefully creates a new tunnel if the previous one was deleted.
	async fn update_tunnel_name(
		&mut self,
		persisted: Option<PersistedTunnel>,
		name: &str,
	) -> Result<(Tunnel, PersistedTunnel), AnyError> {
		let name = name.to_ascii_lowercase();

		let (mut full_tunnel, mut persisted, is_new) = match persisted {
			Some(persisted) => {
				debug!(
					self.log,
					"Found a persisted tunnel, seeing if the name matches..."
				);
				self.get_or_create_tunnel(persisted, Some(&name), NO_REQUEST_OPTIONS)
					.await
			}
			None => {
				debug!(self.log, "Creating a new tunnel with the requested name");
				self.create_tunnel(&name, NO_REQUEST_OPTIONS)
					.await
					.map(|(pt, t)| (t, pt, true))
			}
		}?;

		let desired_tags = self.get_labels(&name);
		if is_new || vec_eq_as_set(&full_tunnel.labels, &desired_tags) {
			return Ok((full_tunnel, persisted));
		}

		debug!(self.log, "Tunnel name changed, applying updates...");

		full_tunnel.labels = desired_tags;

		let updated_tunnel = spanf!(
			self.log,
			self.log.span("dev-tunnel.tag.update"),
			self.client.update_tunnel(&full_tunnel, NO_REQUEST_OPTIONS)
		)
		.map_err(|e| wrap(e, "failed to rename tunnel"))?;

		persisted.name = name;
		self.launcher_tunnel.save(Some(persisted.clone()))?;

		Ok((updated_tunnel, persisted))
	}

	/// Gets the persisted tunnel from the service, or creates a new one.
	/// If `create_with_new_name` is given, the new tunnel has that name
	/// instead of the one previously persisted.
	async fn get_or_create_tunnel(
		&mut self,
		persisted: PersistedTunnel,
		create_with_new_name: Option<&str>,
		options: &TunnelRequestOptions,
	) -> Result<(Tunnel, PersistedTunnel, /* is_new */ bool), AnyError> {
		let tunnel_lookup = spanf!(
			self.log,
			self.log.span("dev-tunnel.tag.get"),
			self.client.get_tunnel(&persisted.locator(), options)
		);

		match tunnel_lookup {
			Ok(ft) => Ok((ft, persisted, false)),
			Err(HttpError::ResponseError(e))
				if e.status_code == StatusCode::NOT_FOUND
					|| e.status_code == StatusCode::FORBIDDEN =>
			{
				let (persisted, tunnel) = self
					.create_tunnel(create_with_new_name.unwrap_or(&persisted.name), options)
					.await?;
				Ok((tunnel, persisted, true))
			}
			Err(e) => Err(wrap(e, "failed to lookup tunnel").into()),
		}
	}

	/// Starts a new tunnel for the code server on the port. Unlike `start_new_tunnel`,
	/// this attempts to reuse or create a tunnel of a preferred name or of a generated friendly tunnel name.
	pub async fn start_new_launcher_tunnel(
		&mut self,
		preferred_name: Option<&str>,
		use_random_name: bool,
		preserve_ports: &[u16],
	) -> Result<ActiveTunnel, AnyError> {
		let (mut tunnel, persisted) = match self.launcher_tunnel.load() {
			Some(mut persisted) => {
				if let Some(preferred_name) = preferred_name.map(|n| n.to_ascii_lowercase()) {
					if persisted.name.to_ascii_lowercase() != preferred_name {
						(_, persisted) = self
							.update_tunnel_name(Some(persisted), &preferred_name)
							.await?;
					}
				}

				let (tunnel, persisted, _) = self
					.get_or_create_tunnel(persisted, None, &HOST_TUNNEL_REQUEST_OPTIONS)
					.await?;
				(tunnel, persisted)
			}
			None => {
				debug!(self.log, "No code server tunnel found, creating new one");
				let name = self
					.get_name_for_tunnel(preferred_name, use_random_name)
					.await?;
				let (persisted, full_tunnel) = self
					.create_tunnel(&name, &HOST_TUNNEL_REQUEST_OPTIONS)
					.await?;
				(full_tunnel, persisted)
			}
		};

		tunnel = self
			.sync_tunnel_tags(
				&self.client,
				&persisted.name,
				tunnel,
				&HOST_TUNNEL_REQUEST_OPTIONS,
			)
			.await?;

		let locator = TunnelLocator::try_from(&tunnel).unwrap();
		let host_token = get_host_token_from_tunnel(&tunnel);

		for port_to_delete in tunnel
			.ports
			.iter()
			.filter(|p: &&TunnelPort| !preserve_ports.contains(&p.port_number))
		{
			let output_fut = self.client.delete_tunnel_port(
				&locator,
				port_to_delete.port_number,
				NO_REQUEST_OPTIONS,
			);
			spanf!(
				self.log,
				self.log.span("dev-tunnel.port.delete"),
				output_fut
			)
			.map_err(|e| wrap(e, "failed to delete port"))?;
		}

		// cleanup any old trailing tunnel endpoints
		for endpoint in tunnel.endpoints {
			let fut = self.client.delete_tunnel_endpoints(
				&locator,
				&endpoint.host_id,
				NO_REQUEST_OPTIONS,
			);

			spanf!(self.log, self.log.span("dev-tunnel.endpoint.prune"), fut)
				.map_err(|e| wrap(e, "failed to prune tunnel endpoint"))?;
		}

		self.start_tunnel(
			locator.clone(),
			&persisted,
			self.client.clone(),
			LookupAccessTokenProvider::new(
				self.auth.clone(),
				self.client.clone(),
				locator,
				self.log.clone(),
				Some(host_token),
			),
		)
		.await
	}

	async fn create_tunnel(
		&mut self,
		name: &str,
		options: &TunnelRequestOptions,
	) -> Result<(PersistedTunnel, Tunnel), AnyError> {
		info!(self.log, "Creating tunnel with the name: {}", name);

		let tunnel = match self.get_existing_tunnel_with_name(name).await? {
			Some(e) => {
				if tunnel_has_host_connection(&e) {
					return Err(CodeError::TunnelActiveAndInUse(name.to_string()).into());
				}

				let loc = TunnelLocator::try_from(&e).unwrap();
				info!(self.log, "Adopting existing tunnel (ID={:?})", loc);
				spanf!(
					self.log,
					self.log.span("dev-tunnel.tag.get"),
					self.client.get_tunnel(&loc, &HOST_TUNNEL_REQUEST_OPTIONS)
				)
				.map_err(|e| wrap(e, "failed to lookup tunnel"))?
			}
			None => loop {
				let result = spanf!(
					self.log,
					self.log.span("dev-tunnel.create"),
					self.client.create_tunnel(
						Tunnel {
							labels: self.get_labels(name),
							..Default::default()
						},
						options
					)
				);

				match result {
					Err(HttpError::ResponseError(e))
						if e.status_code == StatusCode::TOO_MANY_REQUESTS =>
					{
						if let Some(d) = e.get_details() {
							let detail = d.detail.unwrap_or_else(|| "unknown".to_string());
							if detail.contains(TUNNEL_COUNT_LIMIT_NAME)
								&& self.try_recycle_tunnel().await?
							{
								continue;
							}

							return Err(AnyError::from(TunnelCreationFailed(
								name.to_string(),
								detail,
							)));
						}

						return Err(AnyError::from(TunnelCreationFailed(
								name.to_string(),
								"You have exceeded a limit for the port fowarding service. Please remove other machines before trying to add this machine.".to_string(),
							)));
					}
					Err(e) => {
						return Err(AnyError::from(TunnelCreationFailed(
							name.to_string(),
							format!("{e:?}"),
						)))
					}
					Ok(t) => break t,
				}
			},
		};

		let pt = PersistedTunnel {
			cluster: tunnel.cluster_id.clone().unwrap(),
			id: tunnel.tunnel_id.clone().unwrap(),
			name: name.to_string(),
		};

		self.launcher_tunnel.save(Some(pt.clone()))?;
		Ok((pt, tunnel))
	}

	/// Gets the expected tunnel tags
	fn get_labels(&self, name: &str) -> Vec<String> {
		vec![
			name.to_string(),
			PROTOCOL_VERSION_TAG.to_string(),
			self.tag.to_string(),
			tunnel_flags::create(&self.log),
		]
	}

	/// Ensures the tunnel contains a tag for the current PROTCOL_VERSION, and no
	/// other version tags.
	async fn sync_tunnel_tags(
		&self,
		client: &TunnelManagementClient,
		name: &str,
		tunnel: Tunnel,
		options: &TunnelRequestOptions,
	) -> Result<Tunnel, AnyError> {
		let new_labels = self.get_labels(name);
		if vec_eq_as_set(&tunnel.labels, &new_labels) {
			return Ok(tunnel);
		}

		debug!(
			self.log,
			"Updating tunnel tags {} -> {}",
			tunnel.labels.join(", "),
			new_labels.join(", ")
		);

		let tunnel_update = Tunnel {
			labels: new_labels,
			tunnel_id: tunnel.tunnel_id.clone(),
			cluster_id: tunnel.cluster_id.clone(),
			..Default::default()
		};

		let result = spanf!(
			self.log,
			self.log.span("dev-tunnel.protocol-tag-update"),
			client.update_tunnel(&tunnel_update, options)
		);

		result.map_err(|e| wrap(e, "tunnel tag update failed").into())
	}

	/// Tries to delete an unused tunnel, and then creates a tunnel with the
	/// given `new_name`.
	async fn try_recycle_tunnel(&mut self) -> Result<bool, AnyError> {
		trace!(
			self.log,
			"Tunnel limit hit, trying to recycle an old tunnel"
		);

		let existing_tunnels = self.list_tunnels_with_tag(OWNED_TUNNEL_TAGS).await?;

		let recyclable = existing_tunnels
			.iter()
			.filter(|t| !tunnel_has_host_connection(t))
			.choose(&mut rand::thread_rng());

		match recyclable {
			Some(tunnel) => {
				trace!(self.log, "Recycling tunnel ID {:?}", tunnel.tunnel_id);
				spanf!(
					self.log,
					self.log.span("dev-tunnel.delete"),
					self.client
						.delete_tunnel(&tunnel.try_into().unwrap(), NO_REQUEST_OPTIONS)
				)
				.map_err(|e| wrap(e, "failed to execute `tunnel delete`"))?;
				Ok(true)
			}
			None => {
				trace!(self.log, "No tunnels available to recycle");
				Ok(false)
			}
		}
	}

	async fn list_tunnels_with_tag(
		&mut self,
		tags: &[&'static str],
	) -> Result<Vec<Tunnel>, AnyError> {
		let tunnels = spanf!(
			self.log,
			self.log.span("dev-tunnel.listall"),
			self.client.list_all_tunnels(&TunnelRequestOptions {
				labels: tags.iter().map(|t| t.to_string()).collect(),
				..Default::default()
			})
		)
		.map_err(|e| wrap(e, "error listing current tunnels"))?;

		Ok(tunnels)
	}

	async fn get_existing_tunnel_with_name(&self, name: &str) -> Result<Option<Tunnel>, AnyError> {
		let existing: Vec<Tunnel> = spanf!(
			self.log,
			self.log.span("dev-tunnel.rename.search"),
			self.client.list_all_tunnels(&TunnelRequestOptions {
				labels: vec![self.tag.to_string(), name.to_string()],
				require_all_labels: true,
				limit: 1,
				include_ports: true,
				token_scopes: vec!["host".to_string()],
				..Default::default()
			})
		)
		.map_err(|e| wrap(e, "failed to list existing tunnels"))?;

		Ok(existing.into_iter().next())
	}

	fn get_placeholder_name() -> String {
		let mut n = clean_hostname_for_tunnel(&gethostname::gethostname().to_string_lossy());
		n.make_ascii_lowercase();
		n.truncate(MAX_TUNNEL_NAME_LENGTH);
		n
	}

	async fn get_name_for_tunnel(
		&mut self,
		preferred_name: Option<&str>,
		mut use_random_name: bool,
	) -> Result<String, AnyError> {
		let existing_tunnels = self.list_tunnels_with_tag(&[self.tag]).await?;
		let is_name_free = |n: &str| {
			!existing_tunnels
				.iter()
				.any(|v| tunnel_has_host_connection(v) && v.labels.iter().any(|t| t == n))
		};

		if let Some(machine_name) = preferred_name {
			let name = machine_name.to_ascii_lowercase();
			if let Err(e) = is_valid_name(&name) {
				info!(self.log, "{} is an invalid name", e);
				return Err(AnyError::from(wrap(e, "invalid name")));
			}
			if is_name_free(&name) {
				return Ok(name);
			}
			info!(
				self.log,
				"{} is already taken, using a random name instead", &name
			);
			use_random_name = true;
		}

		let mut placeholder_name = Self::get_placeholder_name();
		if !is_name_free(&placeholder_name) {
			for i in 2.. {
				let fixed_name = format!("{placeholder_name}{i}");
				if is_name_free(&fixed_name) {
					placeholder_name = fixed_name;
					break;
				}
			}
		}

		if use_random_name || !*IS_INTERACTIVE_CLI {
			return Ok(placeholder_name);
		}

		loop {
			let mut name = prompt_placeholder(
				"What would you like to call this machine?",
				&placeholder_name,
			)?;

			name.make_ascii_lowercase();

			if let Err(e) = is_valid_name(&name) {
				info!(self.log, "{}", e);
				continue;
			}

			if is_name_free(&name) {
				return Ok(name);
			}

			info!(self.log, "The name {} is already in use", name);
		}
	}

	/// Hosts an existing tunnel, where the tunnel ID and host token are given.
	pub async fn start_existing_tunnel(
		&mut self,
		tunnel: ExistingTunnel,
	) -> Result<ActiveTunnel, AnyError> {
		let tunnel_details = PersistedTunnel {
			name: match tunnel.tunnel_name {
				Some(n) => n,
				None => Self::get_placeholder_name(),
			},
			id: tunnel.tunnel_id,
			cluster: tunnel.cluster,
		};

		let mut mgmt = self.client.build();
		mgmt.authorization(tunnels::management::Authorization::Tunnel(
			tunnel.host_token.clone(),
		));

		let client = mgmt.into();
		self.sync_tunnel_tags(
			&client,
			&tunnel_details.name,
			Tunnel {
				cluster_id: Some(tunnel_details.cluster.clone()),
				tunnel_id: Some(tunnel_details.id.clone()),
				..Default::default()
			},
			&HOST_TUNNEL_REQUEST_OPTIONS,
		)
		.await?;

		self.start_tunnel(
			tunnel_details.locator(),
			&tunnel_details,
			client,
			StaticAccessTokenProvider::new(tunnel.host_token),
		)
		.await
	}

	async fn start_tunnel(
		&mut self,
		locator: TunnelLocator,
		tunnel_details: &PersistedTunnel,
		client: TunnelManagementClient,
		access_token: impl AccessTokenProvider + 'static,
	) -> Result<ActiveTunnel, AnyError> {
		let mut manager = ActiveTunnelManager::new(self.log.clone(), client, locator, access_token);

		let endpoint_result = spanf!(
			self.log,
			self.log.span("dev-tunnel.serve.callback"),
			manager.get_endpoint()
		);

		let endpoint = match endpoint_result {
			Ok(endpoint) => endpoint,
			Err(e) => {
				error!(self.log, "Error connecting to tunnel endpoint: {}", e);
				manager.kill().await.ok();
				return Err(e);
			}
		};

		debug!(self.log, "Connected to tunnel endpoint: {:?}", endpoint);

		Ok(ActiveTunnel {
			name: tunnel_details.name.clone(),
			id: tunnel_details.id.clone(),
			manager,
		})
	}
}

#[derive(Clone, Default)]
pub struct StatusLock(Arc<std::sync::Mutex<protocol::singleton::Status>>);

impl StatusLock {
	fn succeed(&self) {
		let mut status = self.0.lock().unwrap();
		status.tunnel = protocol::singleton::TunnelState::Connected;
		status.last_connected_at = Some(chrono::Utc::now());
	}

	fn fail(&self, reason: String) {
		let mut status = self.0.lock().unwrap();
		if let protocol::singleton::TunnelState::Connected = status.tunnel {
			status.last_disconnected_at = Some(chrono::Utc::now());
			status.tunnel = protocol::singleton::TunnelState::Disconnected;
		}
		status.last_fail_reason = Some(reason);
	}

	pub fn read(&self) -> protocol::singleton::Status {
		let status = self.0.lock().unwrap();
		status.clone()
	}
}

struct ActiveTunnelManager {
	close_tx: Option<mpsc::Sender<()>>,
	endpoint_rx: watch::Receiver<Option<Result<TunnelRelayTunnelEndpoint, WrappedError>>>,
	relay: Arc<tokio::sync::Mutex<RelayTunnelHost>>,
	status: StatusLock,
}

impl ActiveTunnelManager {
	pub fn new(
		log: log::Logger,
		mgmt: TunnelManagementClient,
		locator: TunnelLocator,
		access_token: impl AccessTokenProvider + 'static,
	) -> ActiveTunnelManager {
		let (endpoint_tx, endpoint_rx) = watch::channel(None);
		let (close_tx, close_rx) = mpsc::channel(1);

		let relay = Arc::new(tokio::sync::Mutex::new(RelayTunnelHost::new(locator, mgmt)));
		let relay_spawned = relay.clone();

		let status = StatusLock::default();

		let status_spawned = status.clone();
		tokio::spawn(async move {
			ActiveTunnelManager::spawn_tunnel(
				log,
				relay_spawned,
				close_rx,
				endpoint_tx,
				access_token,
				status_spawned,
			)
			.await;
		});

		ActiveTunnelManager {
			endpoint_rx,
			relay,
			close_tx: Some(close_tx),
			status,
		}
	}

	/// Gets a copy of the current tunnel status information
	pub fn get_status(&self) -> StatusLock {
		self.status.clone()
	}

	/// Adds a port for TCP/IP forwarding.
	pub async fn add_port_tcp(
		&self,
		port_number: u16,
		privacy: PortPrivacy,
		protocol: PortProtocol,
	) -> Result<(), WrappedError> {
		self.relay
			.lock()
			.await
			.add_port(&TunnelPort {
				port_number,
				protocol: Some(protocol.to_contract_str().to_string()),
				access_control: Some(privacy_to_tunnel_acl(privacy)),
				..Default::default()
			})
			.await
			.map_err(|e| wrap(e, "error adding port to relay"))?;
		Ok(())
	}

	/// Adds a port for TCP/IP forwarding.
	pub async fn add_port_direct(
		&self,
		port_number: u16,
	) -> Result<mpsc::UnboundedReceiver<ForwardedPortConnection>, WrappedError> {
		self.relay
			.lock()
			.await
			.add_port_raw(&TunnelPort {
				port_number,
				protocol: Some(TUNNEL_PROTOCOL_AUTO.to_owned()),
				access_control: Some(privacy_to_tunnel_acl(PortPrivacy::Private)),
				..Default::default()
			})
			.await
			.map_err(|e| wrap(e, "error adding port to relay"))
	}

	/// Removes a port from TCP/IP forwarding.
	pub async fn remove_port(&self, port_number: u16) -> Result<(), WrappedError> {
		self.relay
			.lock()
			.await
			.remove_port(port_number)
			.await
			.map_err(|e| wrap(e, "error remove port from relay"))
	}

	/// Gets the most recent details from the tunnel process. Returns None if
	/// the process exited before providing details.
	pub async fn get_endpoint(&mut self) -> Result<TunnelRelayTunnelEndpoint, AnyError> {
		loop {
			if let Some(details) = &*self.endpoint_rx.borrow() {
				return details.clone().map_err(AnyError::from);
			}

			if self.endpoint_rx.changed().await.is_err() {
				return Err(DevTunnelError("tunnel creation cancelled".to_string()).into());
			}
		}
	}

	/// Kills the process, and waits for it to exit.
	/// See https://tokio.rs/tokio/topics/shutdown#waiting-for-things-to-finish-shutting-down for how this works
	pub async fn kill(&mut self) -> Result<(), AnyError> {
		if let Some(tx) = self.close_tx.take() {
			drop(tx);
		}

		self.relay
			.lock()
			.await
			.unregister()
			.await
			.map_err(|e| wrap(e, "error unregistering relay"))?;

		while self.endpoint_rx.changed().await.is_ok() {}

		Ok(())
	}

	async fn spawn_tunnel(
		log: log::Logger,
		relay: Arc<tokio::sync::Mutex<RelayTunnelHost>>,
		mut close_rx: mpsc::Receiver<()>,
		endpoint_tx: watch::Sender<Option<Result<TunnelRelayTunnelEndpoint, WrappedError>>>,
		access_token_provider: impl AccessTokenProvider + 'static,
		status: StatusLock,
	) {
		let mut token_ka = access_token_provider.keep_alive();
		let mut backoff = Backoff::new(Duration::from_secs(5), Duration::from_secs(120));

		macro_rules! fail {
			($e: expr, $msg: expr) => {
				let fmt = format!("{}: {}", $msg, $e);
				warning!(log, &fmt);
				status.fail(fmt);
				endpoint_tx.send(Some(Err($e))).ok();
				backoff.delay().await;
			};
		}

		loop {
			debug!(log, "Starting tunnel to server...");

			let access_token = match access_token_provider.refresh_token().await {
				Ok(t) => t,
				Err(e) => {
					fail!(e, "Error refreshing access token, will retry");
					continue;
				}
			};

			// we don't bother making a client that can refresh the token, since
			// the tunnel won't be able to host as soon as the access token expires.
			let handle_res = {
				let mut relay = relay.lock().await;
				relay
					.connect(&access_token)
					.await
					.map_err(|e| wrap(e, "error connecting to tunnel"))
			};

			let mut handle = match handle_res {
				Ok(handle) => handle,
				Err(e) => {
					fail!(e, "Error connecting to relay, will retry");
					continue;
				}
			};

			backoff.reset();
			status.succeed();
			endpoint_tx.send(Some(Ok(handle.endpoint().clone()))).ok();

			tokio::select! {
				// error is mapped like this prevent it being used across an await,
				// which Rust dislikes since there's a non-sendable dyn Error in there
				res = (&mut handle).map_err(|e| wrap(e, "error from tunnel connection")) => {
					if let Err(e) = res {
						fail!(e, "Tunnel exited unexpectedly, reconnecting");
					} else {
						warning!(log, "Tunnel exited unexpectedly but gracefully, reconnecting");
						backoff.delay().await;
					}
				},
				Err(e) = &mut token_ka => {
					error!(log, "access token is no longer valid, exiting: {}", e);
					return;
				},
				_ = close_rx.recv() => {
					trace!(log, "Tunnel closing gracefully");
					trace!(log, "Tunnel closed with result: {:?}", handle.close().await);
					break;
				}
			}
		}
	}
}

struct Backoff {
	failures: u32,
	base_duration: Duration,
	max_duration: Duration,
}

impl Backoff {
	pub fn new(base_duration: Duration, max_duration: Duration) -> Self {
		Self {
			failures: 0,
			base_duration,
			max_duration,
		}
	}

	pub async fn delay(&mut self) {
		tokio::time::sleep(self.next()).await
	}

	pub fn next(&mut self) -> Duration {
		self.failures += 1;
		let duration = self
			.base_duration
			.checked_mul(self.failures)
			.unwrap_or(self.max_duration);
		std::cmp::min(duration, self.max_duration)
	}

	pub fn reset(&mut self) {
		self.failures = 0;
	}
}

/// Cleans up the hostname so it can be used as a tunnel name.
/// See TUNNEL_NAME_PATTERN in the tunnels SDK for the rules we try to use.
fn clean_hostname_for_tunnel(hostname: &str) -> String {
	let mut out = String::new();
	for char in hostname.chars().take(60) {
		match char {
			'-' | '_' | ' ' => {
				out.push('-');
			}
			'0'..='9' | 'a'..='z' | 'A'..='Z' => {
				out.push(char);
			}
			_ => {}
		}
	}

	let trimmed = out.trim_matches('-');
	if trimmed.len() < 2 {
		"remote-machine".to_string() // placeholder if the result was empty
	} else {
		trimmed.to_owned()
	}
}

fn vec_eq_as_set(a: &[String], b: &[String]) -> bool {
	if a.len() != b.len() {
		return false;
	}

	for item in a {
		if !b.contains(item) {
			return false;
		}
	}

	true
}

fn privacy_to_tunnel_acl(privacy: PortPrivacy) -> TunnelAccessControl {
	TunnelAccessControl {
		entries: vec![match privacy {
			PortPrivacy::Public => tunnels::contracts::TunnelAccessControlEntry {
				kind: tunnels::contracts::TunnelAccessControlEntryType::Anonymous,
				provider: None,
				is_inherited: false,
				is_deny: false,
				is_inverse: false,
				organization: None,
				expiration: None,
				subjects: vec![],
				scopes: vec![TUNNEL_ACCESS_SCOPES_CONNECT.to_string()],
			},
			// Ensure private ports are actually private and do not inherit any
			// default visibility that may be set on the tunnel:
			PortPrivacy::Private => tunnels::contracts::TunnelAccessControlEntry {
				kind: tunnels::contracts::TunnelAccessControlEntryType::Anonymous,
				provider: None,
				is_inherited: false,
				is_deny: true,
				is_inverse: false,
				organization: None,
				expiration: None,
				subjects: vec![],
				scopes: vec![TUNNEL_ACCESS_SCOPES_CONNECT.to_string()],
			},
		}],
	}
}

fn tunnel_has_host_connection(tunnel: &Tunnel) -> bool {
	tunnel
		.status
		.as_ref()
		.and_then(|s| s.host_connection_count.as_ref().map(|c| c.get_count() > 0))
		.unwrap_or_default()
}

#[cfg(test)]
mod test {
	use super::*;

	#[test]
	fn test_clean_hostname_for_tunnel() {
		assert_eq!(
			clean_hostname_for_tunnel("hello123"),
			"hello123".to_string()
		);
		assert_eq!(
			clean_hostname_for_tunnel("-cool-name-"),
			"cool-name".to_string()
		);
		assert_eq!(
			clean_hostname_for_tunnel("cool!name with_chars"),
			"coolname-with-chars".to_string()
		);
		assert_eq!(clean_hostname_for_tunnel("z"), "remote-machine".to_string());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/tunnels/legal.rs]---
Location: vscode-main/cli/src/tunnels/legal.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
use crate::constants::IS_INTERACTIVE_CLI;
use crate::state::{LauncherPaths, PersistedState};
use crate::util::errors::{AnyError, CodeError};
use crate::util::input::prompt_yn;
use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};

lazy_static! {
	static ref LICENSE_TEXT: Option<Vec<String>> =
		option_env!("VSCODE_CLI_SERVER_LICENSE").and_then(|s| serde_json::from_str(s).unwrap());
}

const LICENSE_PROMPT: Option<&'static str> = option_env!("VSCODE_CLI_REMOTE_LICENSE_PROMPT");

#[derive(Clone, Default, Serialize, Deserialize)]
struct PersistedConsent {
	pub consented: Option<bool>,
}

pub fn require_consent(
	paths: &LauncherPaths,
	accept_server_license_terms: bool,
) -> Result<(), AnyError> {
	match &*LICENSE_TEXT {
		Some(t) => println!("{}", t.join("\r\n")),
		None => return Ok(()),
	}

	let prompt = match LICENSE_PROMPT {
		Some(p) => p,
		None => return Ok(()),
	};

	let license: PersistedState<PersistedConsent> =
		PersistedState::new(paths.root().join("license_consent.json"));

	let mut load = license.load();
	if let Some(true) = load.consented {
		return Ok(());
	}

	if accept_server_license_terms {
		load.consented = Some(true);
	} else if !*IS_INTERACTIVE_CLI {
		return Err(CodeError::NeedsInteractiveLegalConsent.into());
	} else {
		match prompt_yn(prompt) {
			Ok(true) => {
				load.consented = Some(true);
			}
			Ok(false) => return Err(CodeError::DeniedLegalConset.into()),
			Err(_) => return Err(CodeError::NeedsInteractiveLegalConsent.into()),
		}
	}

	license.save(load)?;
	Ok(())
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/tunnels/local_forwarding.rs]---
Location: vscode-main/cli/src/tunnels/local_forwarding.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use std::{
	collections::HashMap,
	ops::{Index, IndexMut},
	sync::{Arc, Mutex},
};

use tokio::{
	pin,
	sync::{mpsc, watch},
};

use crate::{
	async_pipe::{socket_stream_split, AsyncPipe},
	json_rpc::{new_json_rpc, start_json_rpc},
	log,
	singleton::SingletonServer,
	util::{errors::CodeError, sync::Barrier},
};

use super::{
	dev_tunnels::ActiveTunnel,
	protocol::{
		self,
		forward_singleton::{PortList, SetPortsResponse},
		PortPrivacy, PortProtocol,
	},
	shutdown_signal::ShutdownSignal,
};

#[derive(Default, Clone)]
struct PortCount {
	public: u32,
	private: u32,
}

impl Index<PortPrivacy> for PortCount {
	type Output = u32;

	fn index(&self, privacy: PortPrivacy) -> &Self::Output {
		match privacy {
			PortPrivacy::Public => &self.public,
			PortPrivacy::Private => &self.private,
		}
	}
}

impl IndexMut<PortPrivacy> for PortCount {
	fn index_mut(&mut self, privacy: PortPrivacy) -> &mut Self::Output {
		match privacy {
			PortPrivacy::Public => &mut self.public,
			PortPrivacy::Private => &mut self.private,
		}
	}
}

impl PortCount {
	fn is_empty(&self) -> bool {
		self.public == 0 && self.private == 0
	}

	fn primary_privacy(&self) -> PortPrivacy {
		if self.public > 0 {
			PortPrivacy::Public
		} else {
			PortPrivacy::Private
		}
	}
}
#[derive(Clone)]
struct PortMapRec {
	count: PortCount,
	protocol: PortProtocol,
}

type PortMap = HashMap<u16, PortMapRec>;

/// The PortForwardingHandle is given out to multiple consumers to allow
/// them to set_ports that they want to be forwarded.
struct PortForwardingSender {
	/// Todo: when `SyncUnsafeCell` is no longer nightly, we can use it here with
	/// the following comment:
	///
	/// SyncUnsafeCell is used and safe here because PortForwardingSender is used
	/// exclusively in synchronous dispatch *and* we create a new sender in the
	/// context for each connection, in `serve_singleton_rpc`.
	///
	/// If PortForwardingSender is ever used in a different context, this should
	/// be refactored, e.g. to use locks or `&mut self` in set_ports`
	///
	/// see https://doc.rust-lang.org/stable/std/cell/struct.SyncUnsafeCell.html
	current: Mutex<PortList>,
	sender: Arc<Mutex<watch::Sender<PortMap>>>,
}

impl PortForwardingSender {
	pub fn set_ports(&self, ports: PortList) {
		let mut current = self.current.lock().unwrap();
		self.sender.lock().unwrap().send_modify(|v| {
			for p in current.iter() {
				if !ports.contains(p) {
					let n = v.get_mut(&p.number).expect("expected port in map");
					n.count[p.privacy] -= 1;
					if n.count.is_empty() {
						v.remove(&p.number);
					}
				}
			}

			for p in ports.iter() {
				if !current.contains(p) {
					match v.get_mut(&p.number) {
						Some(n) => {
							n.count[p.privacy] += 1;
							n.protocol = p.protocol;
						}
						None => {
							let mut count = PortCount::default();
							count[p.privacy] += 1;
							v.insert(
								p.number,
								PortMapRec {
									count,
									protocol: p.protocol,
								},
							);
						}
					};
				}
			}

			current.splice(.., ports);
		});
	}
}

impl Clone for PortForwardingSender {
	fn clone(&self) -> Self {
		Self {
			current: Mutex::new(vec![]),
			sender: self.sender.clone(),
		}
	}
}

impl Drop for PortForwardingSender {
	fn drop(&mut self) {
		self.set_ports(vec![]);
	}
}

struct PortForwardingReceiver {
	receiver: watch::Receiver<PortMap>,
}

impl PortForwardingReceiver {
	pub fn new() -> (PortForwardingSender, Self) {
		let (sender, receiver) = watch::channel(HashMap::new());
		let handle = PortForwardingSender {
			current: Mutex::new(vec![]),
			sender: Arc::new(Mutex::new(sender)),
		};

		let tracker = Self { receiver };

		(handle, tracker)
	}

	/// Applies all changes from PortForwardingHandles to the tunnel.
	pub async fn apply_to(&mut self, log: log::Logger, tunnel: Arc<ActiveTunnel>) {
		let mut current: PortMap = HashMap::new();
		while self.receiver.changed().await.is_ok() {
			let next = self.receiver.borrow().clone();

			for (port, rec) in current.iter() {
				let privacy = rec.count.primary_privacy();
				if !matches!(next.get(port), Some(n) if n.count.primary_privacy() == privacy) {
					match tunnel.remove_port(*port).await {
						Ok(_) => info!(
							log,
							"stopped forwarding {} port {} at {:?}", rec.protocol, *port, privacy
						),
						Err(e) => error!(
							log,
							"failed to stop forwarding {} port {}: {}", rec.protocol, port, e
						),
					}
				}
			}

			for (port, rec) in next.iter() {
				let privacy = rec.count.primary_privacy();
				if !matches!(current.get(port), Some(n) if n.count.primary_privacy() == privacy) {
					match tunnel.add_port_tcp(*port, privacy, rec.protocol).await {
						Ok(_) => info!(
							log,
							"forwarding {} port {} at {:?}", rec.protocol, port, privacy
						),
						Err(e) => error!(
							log,
							"failed to forward {} port {}: {}", rec.protocol, port, e
						),
					}
				}
			}

			current = next;
		}
	}
}

pub struct SingletonClientArgs {
	pub log: log::Logger,
	pub stream: AsyncPipe,
	pub shutdown: Barrier<ShutdownSignal>,
	pub port_requests: watch::Receiver<PortList>,
}

#[derive(Clone)]
struct SingletonServerContext {
	log: log::Logger,
	handle: PortForwardingSender,
	tunnel: Arc<ActiveTunnel>,
}

/// Serves a client singleton for port forwarding.
pub async fn client(args: SingletonClientArgs) -> Result<(), std::io::Error> {
	let mut rpc = new_json_rpc();
	let (msg_tx, msg_rx) = mpsc::unbounded_channel();
	let SingletonClientArgs {
		log,
		shutdown,
		stream,
		mut port_requests,
	} = args;

	debug!(
		log,
		"An existing port forwarding process is running on this machine, connecting to it..."
	);

	let caller = rpc.get_caller(msg_tx);
	let rpc = rpc.methods(()).build(log.clone());
	let (read, write) = socket_stream_split(stream);

	let serve = start_json_rpc(rpc, read, write, msg_rx, shutdown);
	let forward = async move {
		while port_requests.changed().await.is_ok() {
			let ports = port_requests.borrow().clone();
			let r = caller
				.call::<_, _, protocol::forward_singleton::SetPortsResponse>(
					protocol::forward_singleton::METHOD_SET_PORTS,
					protocol::forward_singleton::SetPortsParams { ports },
				)
				.await
				.unwrap();

			match r {
				Err(e) => error!(log, "failed to set ports: {:?}", e),
				Ok(r) => print_forwarding_addr(&r),
			};
		}
	};

	tokio::select! {
		r = serve => r.map(|_| ()),
		_ = forward => Ok(()),
	}
}

/// Serves a port-forwarding singleton.
pub async fn server(
	log: log::Logger,
	tunnel: ActiveTunnel,
	server: SingletonServer,
	mut port_requests: watch::Receiver<PortList>,
	shutdown_rx: Barrier<ShutdownSignal>,
) -> Result<(), CodeError> {
	let tunnel = Arc::new(tunnel);
	let (forward_tx, mut forward_rx) = PortForwardingReceiver::new();

	let forward_own_tunnel = tunnel.clone();
	let forward_own_tx = forward_tx.clone();
	let forward_own = async move {
		while port_requests.changed().await.is_ok() {
			forward_own_tx.set_ports(port_requests.borrow().clone());
			print_forwarding_addr(&SetPortsResponse {
				port_format: forward_own_tunnel.get_port_format().ok(),
			});
		}
	};

	tokio::select! {
		_ = forward_own => Ok(()),
		_ = forward_rx.apply_to(log.clone(), tunnel.clone()) => Ok(()),
		r = serve_singleton_rpc(server, log, tunnel, forward_tx, shutdown_rx) => r,
	}
}

async fn serve_singleton_rpc(
	mut server: SingletonServer,
	log: log::Logger,
	tunnel: Arc<ActiveTunnel>,
	forward_tx: PortForwardingSender,
	shutdown_rx: Barrier<ShutdownSignal>,
) -> Result<(), CodeError> {
	let mut own_shutdown = shutdown_rx.clone();
	let shutdown_fut = own_shutdown.wait();
	pin!(shutdown_fut);

	loop {
		let cnx = tokio::select! {
			c = server.accept() => c?,
			_ = &mut shutdown_fut => return Ok(()),
		};

		let (read, write) = socket_stream_split(cnx);
		let shutdown_rx = shutdown_rx.clone();

		let handle = forward_tx.clone();
		let log = log.clone();
		let tunnel = tunnel.clone();
		tokio::spawn(async move {
			// we make an rpc for the connection instead of re-using a dispatcher
			// so that we can have the "handle" drop when the connection drops.
			let rpc = new_json_rpc();
			let mut rpc = rpc.methods(SingletonServerContext {
				log: log.clone(),
				handle,
				tunnel,
			});

			rpc.register_sync(
				protocol::forward_singleton::METHOD_SET_PORTS,
				|p: protocol::forward_singleton::SetPortsParams, ctx| {
					info!(ctx.log, "client setting ports to {:?}", p.ports);
					ctx.handle.set_ports(p.ports);
					Ok(SetPortsResponse {
						port_format: ctx.tunnel.get_port_format().ok(),
					})
				},
			);

			let _ = start_json_rpc(rpc.build(log), read, write, (), shutdown_rx).await;
		});
	}
}

fn print_forwarding_addr(r: &SetPortsResponse) {
	eprintln!("{}\n", serde_json::to_string(r).unwrap());
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/tunnels/nosleep.rs]---
Location: vscode-main/cli/src/tunnels/nosleep.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

#[cfg(target_os = "windows")]
pub type SleepInhibitor = super::nosleep_windows::SleepInhibitor;

#[cfg(target_os = "linux")]
pub type SleepInhibitor = super::nosleep_linux::SleepInhibitor;

#[cfg(target_os = "macos")]
pub type SleepInhibitor = super::nosleep_macos::SleepInhibitor;
```

--------------------------------------------------------------------------------

---[FILE: cli/src/tunnels/nosleep_linux.rs]---
Location: vscode-main/cli/src/tunnels/nosleep_linux.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use zbus::{dbus_proxy, Connection};

use crate::{
	constants::APPLICATION_NAME,
	util::errors::{wrap, AnyError},
};

/// An basically undocumented API, but seems widely implemented, and is what
/// browsers use for sleep inhibition. The downside is that it also *may*
/// disable the screensaver. A much better and more granular API is available
/// on `org.freedesktop.login1.Manager`, but this requires administrative
/// permission to request inhibition, which is not possible here.
///
/// See https://source.chromium.org/chromium/chromium/src/+/main:services/device/wake_lock/power_save_blocker/power_save_blocker_linux.cc;l=54;drc=2e85357a8b76996981cc6f783853a49df2cedc3a
#[dbus_proxy(
	interface = "org.freedesktop.PowerManagement.Inhibit",
	gen_blocking = false,
	default_service = "org.freedesktop.PowerManagement.Inhibit",
	default_path = "/org/freedesktop/PowerManagement/Inhibit"
)]
trait PMInhibitor {
	#[dbus_proxy(name = "Inhibit")]
	fn inhibit(&self, what: &str, why: &str) -> zbus::Result<u32>;
}

/// A slightly better documented version which seems commonly used.
#[dbus_proxy(
	interface = "org.freedesktop.ScreenSaver",
	gen_blocking = false,
	default_service = "org.freedesktop.ScreenSaver",
	default_path = "/org/freedesktop/ScreenSaver"
)]
trait ScreenSaver {
	#[dbus_proxy(name = "Inhibit")]
	fn inhibit(&self, what: &str, why: &str) -> zbus::Result<u32>;
}

pub struct SleepInhibitor {
	_connection: Connection, // Inhibition is released when the connection is closed
}

impl SleepInhibitor {
	pub async fn new() -> Result<Self, AnyError> {
		let connection = Connection::session()
			.await
			.map_err(|e| wrap(e, "error creating dbus session"))?;

		macro_rules! try_inhibit {
			($proxy:ident) => {
				match $proxy::new(&connection).await {
					Ok(proxy) => proxy.inhibit(APPLICATION_NAME, "running tunnel").await,
					Err(e) => Err(e),
				}
			};
		}

		if let Err(e1) = try_inhibit!(PMInhibitorProxy) {
			if let Err(e2) = try_inhibit!(ScreenSaverProxy) {
				return Err(wrap(
					e2,
					format!(
						"error requesting sleep inhibition, pminhibitor gave {e1}, screensaver gave"
					),
				)
				.into());
			}
		}

		Ok(SleepInhibitor {
			_connection: connection,
		})
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/tunnels/nosleep_macos.rs]---
Location: vscode-main/cli/src/tunnels/nosleep_macos.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use std::io;

use core_foundation::base::TCFType;
use core_foundation::string::{CFString, CFStringRef};
use libc::c_int;

use crate::constants::TUNNEL_ACTIVITY_NAME;

extern "C" {
	pub fn IOPMAssertionCreateWithName(
		assertion_type: CFStringRef,
		assertion_level: u32,
		assertion_name: CFStringRef,
		assertion_id: &mut u32,
	) -> c_int;

	pub fn IOPMAssertionRelease(assertion_id: u32) -> c_int;
}

const NUM_ASSERTIONS: usize = 2;

const ASSERTIONS: [&str; NUM_ASSERTIONS] = ["PreventUserIdleSystemSleep", "PreventSystemSleep"];

struct Assertion(u32);

impl Assertion {
	pub fn make(typ: &CFString, name: &CFString) -> io::Result<Self> {
		let mut assertion_id = 0;
		let result = unsafe {
			IOPMAssertionCreateWithName(
				typ.as_concrete_TypeRef(),
				255,
				name.as_concrete_TypeRef(),
				&mut assertion_id,
			)
		};

		if result != 0 {
			Err(io::Error::last_os_error())
		} else {
			Ok(Self(assertion_id))
		}
	}
}

impl Drop for Assertion {
	fn drop(&mut self) {
		unsafe {
			IOPMAssertionRelease(self.0);
		}
	}
}

pub struct SleepInhibitor {
	_assertions: Vec<Assertion>,
}

impl SleepInhibitor {
	pub async fn new() -> io::Result<Self> {
		let mut assertions = Vec::with_capacity(NUM_ASSERTIONS);
		let assertion_name = CFString::from_static_string(TUNNEL_ACTIVITY_NAME);
		for typ in ASSERTIONS {
			assertions.push(Assertion::make(
				&CFString::from_static_string(typ),
				&assertion_name,
			)?);
		}

		Ok(Self {
			_assertions: assertions,
		})
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/tunnels/nosleep_windows.rs]---
Location: vscode-main/cli/src/tunnels/nosleep_windows.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use std::io;

use winapi::{
	ctypes::c_void,
	um::{
		handleapi::CloseHandle,
		minwinbase::REASON_CONTEXT,
		winbase::{PowerClearRequest, PowerCreateRequest, PowerSetRequest},
		winnt::{
			PowerRequestSystemRequired, POWER_REQUEST_CONTEXT_SIMPLE_STRING,
			POWER_REQUEST_CONTEXT_VERSION, POWER_REQUEST_TYPE,
		},
	},
};

use crate::constants::TUNNEL_ACTIVITY_NAME;

struct Request(*mut c_void);

impl Request {
	pub fn new() -> io::Result<Self> {
		let mut reason: Vec<u16> = TUNNEL_ACTIVITY_NAME.encode_utf16().chain([0u16]).collect();
		let mut context = REASON_CONTEXT {
			Version: POWER_REQUEST_CONTEXT_VERSION,
			Flags: POWER_REQUEST_CONTEXT_SIMPLE_STRING,
			Reason: unsafe { std::mem::zeroed() },
		};
		unsafe { *context.Reason.SimpleReasonString_mut() = reason.as_mut_ptr() };

		let request = unsafe { PowerCreateRequest(&mut context) };
		if request.is_null() {
			return Err(io::Error::last_os_error());
		}

		Ok(Self(request))
	}

	pub fn set(&self, request_type: POWER_REQUEST_TYPE) -> io::Result<()> {
		let result = unsafe { PowerSetRequest(self.0, request_type) };
		if result == 0 {
			return Err(io::Error::last_os_error());
		}

		Ok(())
	}
}

impl Drop for Request {
	fn drop(&mut self) {
		unsafe {
			CloseHandle(self.0);
		}
	}
}

pub struct SleepInhibitor {
	request: Request,
}

impl SleepInhibitor {
	pub async fn new() -> io::Result<Self> {
		let request = Request::new()?;
		request.set(PowerRequestSystemRequired)?;
		Ok(Self { request })
	}
}

impl Drop for SleepInhibitor {
	fn drop(&mut self) {
		unsafe {
			PowerClearRequest(self.request.0, PowerRequestSystemRequired);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/tunnels/paths.rs]---
Location: vscode-main/cli/src/tunnels/paths.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use std::{
	fs::{read_dir, read_to_string, remove_dir_all, write},
	path::PathBuf,
};

use serde::{Deserialize, Serialize};

use crate::{
	options::{self, Quality},
	state::LauncherPaths,
	util::{
		errors::{wrap, AnyError, WrappedError},
		machine,
	},
};

pub const SERVER_FOLDER_NAME: &str = "server";

pub struct ServerPaths {
	// Directory into which the server is downloaded
	pub server_dir: PathBuf,
	// Executable path, within the server_id
	pub executable: PathBuf,
	// File where logs for the server should be written.
	pub logfile: PathBuf,
	// File where the process ID for the server should be written.
	pub pidfile: PathBuf,
}

impl ServerPaths {
	// Queries the system to determine the process ID of the running server.
	// Returns the process ID, if the server is running.
	pub fn get_running_pid(&self) -> Option<u32> {
		if let Some(pid) = self.read_pid() {
			return match machine::process_at_path_exists(pid, &self.executable) {
				true => Some(pid),
				false => None,
			};
		}

		if let Some(pid) = machine::find_running_process(&self.executable) {
			// attempt to backfill process ID:
			self.write_pid(pid).ok();
			return Some(pid);
		}

		None
	}

	/// Delete the server directory
	pub fn delete(&self) -> Result<(), WrappedError> {
		remove_dir_all(&self.server_dir).map_err(|e| {
			wrap(
				e,
				format!("error deleting server dir {}", self.server_dir.display()),
			)
		})
	}

	// VS Code Server pid
	pub fn write_pid(&self, pid: u32) -> Result<(), WrappedError> {
		write(&self.pidfile, format!("{pid}")).map_err(|e| {
			wrap(
				e,
				format!("error writing process id into {}", self.pidfile.display()),
			)
		})
	}

	fn read_pid(&self) -> Option<u32> {
		read_to_string(&self.pidfile)
			.ok()
			.and_then(|s| s.parse::<u32>().ok())
	}
}

#[derive(Serialize, Deserialize, Clone, PartialEq, Eq)]
pub struct InstalledServer {
	pub quality: options::Quality,
	pub commit: String,
	pub headless: bool,
}

impl InstalledServer {
	/// Gets path information about where a specific server should be stored.
	pub fn server_paths(&self, p: &LauncherPaths) -> ServerPaths {
		let server_dir = self.get_install_folder(p);
		ServerPaths {
			// allow using the OSS server in development via an override
			executable: if let Some(p) = option_env!("VSCODE_CLI_OVERRIDE_SERVER_PATH") {
				PathBuf::from(p)
			} else {
				server_dir
					.join(SERVER_FOLDER_NAME)
					.join("bin")
					.join(self.quality.server_entrypoint())
			},
			logfile: server_dir.join("log.txt"),
			pidfile: server_dir.join("pid.txt"),
			server_dir,
		}
	}

	fn get_install_folder(&self, p: &LauncherPaths) -> PathBuf {
		p.server_cache.path().join(if !self.headless {
			format!("{}-web", get_server_folder_name(self.quality, &self.commit))
		} else {
			get_server_folder_name(self.quality, &self.commit)
		})
	}
}

/// Prunes servers not currently running, and returns the deleted servers.
pub fn prune_stopped_servers(launcher_paths: &LauncherPaths) -> Result<Vec<ServerPaths>, AnyError> {
	get_all_servers(launcher_paths)
		.into_iter()
		.map(|s| s.server_paths(launcher_paths))
		.filter(|s| s.get_running_pid().is_none())
		.map(|s| s.delete().map(|_| s))
		.collect::<Result<_, _>>()
		.map_err(AnyError::from)
}

// Gets a list of all servers which look like they might be running.
pub fn get_all_servers(lp: &LauncherPaths) -> Vec<InstalledServer> {
	let mut servers: Vec<InstalledServer> = vec![];
	if let Ok(children) = read_dir(lp.server_cache.path()) {
		for child in children.flatten() {
			let fname = child.file_name();
			let fname = fname.to_string_lossy();
			let (quality, commit) = match fname.split_once('-') {
				Some(r) => r,
				None => continue,
			};

			let quality = match options::Quality::try_from(quality) {
				Ok(q) => q,
				Err(_) => continue,
			};

			servers.push(InstalledServer {
				quality,
				commit: commit.to_string(),
				headless: true,
			});
		}
	}

	servers
}

pub fn get_server_folder_name(quality: Quality, commit: &str) -> String {
	format!("{quality}-{commit}")
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/tunnels/port_forwarder.rs]---
Location: vscode-main/cli/src/tunnels/port_forwarder.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use std::collections::HashSet;

use tokio::sync::{mpsc, oneshot};

use crate::{
	constants::CONTROL_PORT,
	util::errors::{AnyError, CannotForwardControlPort, ServerHasClosed},
};

use super::{
	dev_tunnels::ActiveTunnel,
	protocol::{PortPrivacy, PortProtocol},
};

pub enum PortForwardingRec {
	Forward(u16, PortPrivacy, oneshot::Sender<Result<String, AnyError>>),
	Unforward(u16, oneshot::Sender<Result<(), AnyError>>),
}

/// Provides a port forwarding service for connected clients. Clients can make
/// requests on it, which are (and *must be*) processed by calling the `.process()`
/// method on the forwarder.
pub struct PortForwardingProcessor {
	tx: mpsc::Sender<PortForwardingRec>,
	rx: mpsc::Receiver<PortForwardingRec>,
	forwarded: HashSet<u16>,
}

impl PortForwardingProcessor {
	pub fn new() -> Self {
		let (tx, rx) = mpsc::channel(8);
		Self {
			tx,
			rx,
			forwarded: HashSet::new(),
		}
	}

	/// Gets a handle that can be passed off to consumers of port forwarding.
	pub fn handle(&self) -> PortForwarding {
		PortForwarding {
			tx: self.tx.clone(),
		}
	}

	/// Receives port forwarding requests. Consumers MUST call `process()`
	/// with the received requests.
	pub async fn recv(&mut self) -> Option<PortForwardingRec> {
		self.rx.recv().await
	}

	/// Processes the incoming forwarding request.
	pub async fn process(&mut self, req: PortForwardingRec, tunnel: &mut ActiveTunnel) {
		match req {
			PortForwardingRec::Forward(port, privacy, tx) => {
				tx.send(self.process_forward(port, privacy, tunnel).await)
					.ok();
			}
			PortForwardingRec::Unforward(port, tx) => {
				tx.send(self.process_unforward(port, tunnel).await).ok();
			}
		}
	}

	async fn process_unforward(
		&mut self,
		port: u16,
		tunnel: &mut ActiveTunnel,
	) -> Result<(), AnyError> {
		if port == CONTROL_PORT {
			return Err(CannotForwardControlPort().into());
		}

		tunnel.remove_port(port).await?;
		self.forwarded.remove(&port);
		Ok(())
	}

	async fn process_forward(
		&mut self,
		port: u16,
		privacy: PortPrivacy,
		tunnel: &mut ActiveTunnel,
	) -> Result<String, AnyError> {
		if port == CONTROL_PORT {
			return Err(CannotForwardControlPort().into());
		}

		if !self.forwarded.contains(&port) {
			tunnel
				.add_port_tcp(port, privacy, PortProtocol::Auto)
				.await?;
			self.forwarded.insert(port);
		}

		tunnel.get_port_uri(port)
	}
}

#[derive(Clone)]
pub struct PortForwarding {
	tx: mpsc::Sender<PortForwardingRec>,
}

impl PortForwarding {
	pub async fn forward(&self, port: u16, privacy: PortPrivacy) -> Result<String, AnyError> {
		let (tx, rx) = oneshot::channel();
		let req = PortForwardingRec::Forward(port, privacy, tx);

		if self.tx.send(req).await.is_err() {
			return Err(ServerHasClosed().into());
		}

		match rx.await {
			Ok(r) => r,
			Err(_) => Err(ServerHasClosed().into()),
		}
	}

	pub async fn unforward(&self, port: u16) -> Result<(), AnyError> {
		let (tx, rx) = oneshot::channel();
		let req = PortForwardingRec::Unforward(port, tx);

		if self.tx.send(req).await.is_err() {
			return Err(ServerHasClosed().into());
		}

		match rx.await {
			Ok(r) => r,
			Err(_) => Err(ServerHasClosed().into()),
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/tunnels/protocol.rs]---
Location: vscode-main/cli/src/tunnels/protocol.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
use std::collections::HashMap;

use crate::{
	constants::{PROTOCOL_VERSION, VSCODE_CLI_VERSION},
	options::Quality,
	update_service::Platform,
};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Debug)]
#[serde(tag = "method", content = "params", rename_all = "camelCase")]
#[allow(non_camel_case_types)]
pub enum ClientRequestMethod<'a> {
	servermsg(RefServerMessageParams<'a>),
	serverclose(ServerClosedParams),
	serverlog(ServerLog<'a>),
	makehttpreq(HttpRequestParams<'a>),
	version(VersionResponse),
}

#[derive(Deserialize, Debug)]
pub struct HttpBodyParams {
	#[serde(with = "serde_bytes")]
	pub segment: Vec<u8>,
	pub complete: bool,
	pub req_id: u32,
}

#[derive(Serialize, Debug)]
pub struct HttpRequestParams<'a> {
	pub url: &'a str,
	pub method: &'static str,
	pub req_id: u32,
}

#[derive(Deserialize, Debug)]
pub struct HttpHeadersParams {
	pub status_code: u16,
	pub headers: Vec<(String, String)>,
	pub req_id: u32,
}

#[derive(Deserialize, Debug)]
pub struct ForwardParams {
	pub port: u16,
	#[serde(default)]
	pub public: bool,
}

#[derive(Deserialize, Debug)]
pub struct UnforwardParams {
	pub port: u16,
}

#[derive(Serialize)]
pub struct ForwardResult {
	pub uri: String,
}

#[derive(Deserialize, Debug)]
pub struct ServeParams {
	pub socket_id: u16,
	pub commit_id: Option<String>,
	pub quality: Quality,
	pub extensions: Vec<String>,
	/// Optional preferred connection token.
	#[serde(default)]
	pub connection_token: Option<String>,
	#[serde(default)]
	pub use_local_download: bool,
	/// If true, the client and server should gzip servermsg's sent in either direction.
	#[serde(default)]
	pub compress: bool,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct EmptyObject {}

#[derive(Serialize, Deserialize, Debug)]
pub struct UpdateParams {
	pub do_update: bool,
}

#[derive(Deserialize, Debug)]
pub struct ServerMessageParams {
	pub i: u16,
	#[serde(with = "serde_bytes")]
	pub body: Vec<u8>,
}

#[derive(Serialize, Debug)]
pub struct ServerClosedParams {
	pub i: u16,
}

#[derive(Serialize, Debug)]
pub struct RefServerMessageParams<'a> {
	pub i: u16,
	#[serde(with = "serde_bytes")]
	pub body: &'a [u8],
}

#[derive(Serialize)]
pub struct UpdateResult {
	pub up_to_date: bool,
	pub did_update: bool,
}

#[derive(Serialize, Debug)]
pub struct ToClientRequest<'a> {
	pub id: Option<u32>,
	#[serde(flatten)]
	pub params: ClientRequestMethod<'a>,
}

#[derive(Debug, Default, Serialize)]
pub struct ServerLog<'a> {
	pub line: &'a str,
	pub level: u8,
}

#[derive(Serialize)]
pub struct GetHostnameResponse {
	pub value: String,
}

#[derive(Serialize)]
pub struct GetEnvResponse {
	pub env: HashMap<String, String>,
	pub os_platform: &'static str,
	pub os_release: String,
}

/// Method: `kill`. Sends a generic, platform-specific kill command to the process.
#[derive(Deserialize)]
pub struct SysKillRequest {
	pub pid: u32,
}

#[derive(Serialize)]
pub struct SysKillResponse {
	pub success: bool,
}

/// Methods: `fs_read`/`fs_write`/`fs_rm`/`fs_mkdirp`/`fs_stat`
///  - fs_read: reads into a stream returned from the method,
///  - fs_write: writes from a stream passed to the method.
///  - fs_rm: recursively removes the file
///  - fs_mkdirp: recursively creates the directory
///  - fs_readdir: reads directory contents
///  - fs_stat: stats the given path
///  - fs_connect: connect to the given unix or named pipe socket, streaming
///    data in and out from the method's stream.
#[derive(Deserialize)]
pub struct FsSinglePathRequest {
	pub path: String,
}

#[derive(Serialize)]
pub enum FsFileKind {
	#[serde(rename = "dir")]
	Directory,
	#[serde(rename = "file")]
	File,
	#[serde(rename = "link")]
	Link,
}

impl From<std::fs::FileType> for FsFileKind {
	fn from(kind: std::fs::FileType) -> Self {
		if kind.is_dir() {
			Self::Directory
		} else if kind.is_file() {
			Self::File
		} else if kind.is_symlink() {
			Self::Link
		} else {
			unreachable!()
		}
	}
}

#[derive(Serialize, Default)]
pub struct FsStatResponse {
	pub exists: bool,
	pub size: Option<u64>,
	#[serde(rename = "type")]
	pub kind: Option<FsFileKind>,
}

#[derive(Serialize)]
pub struct FsReadDirResponse {
	pub contents: Vec<FsReadDirEntry>,
}

#[derive(Serialize)]
pub struct FsReadDirEntry {
	pub name: String,
	#[serde(rename = "type")]
	pub kind: Option<FsFileKind>,
}

/// Method: `fs_reaname`. Renames a file.
#[derive(Deserialize)]
pub struct FsRenameRequest {
	pub from_path: String,
	pub to_path: String,
}

/// Method: `net_connect`. Connects to a port.
#[derive(Deserialize)]
pub struct NetConnectRequest {
	pub port: u16,
	pub host: String,
}

#[derive(Deserialize, Debug)]
pub struct CallServerHttpParams {
	pub path: String,
	pub method: String,
	pub headers: HashMap<String, String>,
	pub body: Option<Vec<u8>>,
}

#[derive(Serialize)]
pub struct CallServerHttpResult {
	pub status: u16,
	#[serde(with = "serde_bytes")]
	pub body: Vec<u8>,
	pub headers: HashMap<String, String>,
}

#[derive(Serialize, Debug)]
pub struct VersionResponse {
	pub version: &'static str,
	pub protocol_version: u32,
}

impl Default for VersionResponse {
	fn default() -> Self {
		Self {
			version: VSCODE_CLI_VERSION.unwrap_or("dev"),
			protocol_version: PROTOCOL_VERSION,
		}
	}
}

#[derive(Deserialize)]
pub struct SpawnParams {
	pub command: String,
	pub args: Vec<String>,
	#[serde(default)]
	pub cwd: Option<String>,
	#[serde(default)]
	pub env: HashMap<String, String>,
}

#[derive(Deserialize)]
pub struct AcquireCliParams {
	pub platform: Platform,
	pub quality: Quality,
	pub commit_id: Option<String>,
	#[serde(flatten)]
	pub spawn: SpawnParams,
}

#[derive(Serialize)]
pub struct SpawnResult {
	pub message: String,
	pub exit_code: i32,
}

pub const METHOD_CHALLENGE_ISSUE: &str = "challenge_issue";
pub const METHOD_CHALLENGE_VERIFY: &str = "challenge_verify";

#[derive(Serialize, Deserialize)]
pub struct ChallengeIssueParams {
	pub token: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct ChallengeIssueResponse {
	pub challenge: String,
}

#[derive(Deserialize, Serialize)]
pub struct ChallengeVerifyParams {
	pub response: String,
}

#[derive(Serialize, Deserialize, PartialEq, Eq, Copy, Clone, Debug)]
#[serde(rename_all = "lowercase")]
pub enum PortPrivacy {
	Public,
	Private,
}

#[derive(Serialize, Deserialize, PartialEq, Copy, Eq, Clone, Debug)]
#[serde(rename_all = "lowercase")]
pub enum PortProtocol {
	Auto,
	Http,
	Https,
}

impl std::fmt::Display for PortProtocol {
	fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
		write!(f, "{}", self.to_contract_str())
	}
}

impl Default for PortProtocol {
	fn default() -> Self {
		Self::Auto
	}
}

impl PortProtocol {
	pub fn to_contract_str(&self) -> &'static str {
		match *self {
			Self::Auto => tunnels::contracts::TUNNEL_PROTOCOL_AUTO,
			Self::Http => tunnels::contracts::TUNNEL_PROTOCOL_HTTP,
			Self::Https => tunnels::contracts::TUNNEL_PROTOCOL_HTTPS,
		}
	}
}

pub mod forward_singleton {
	use serde::{Deserialize, Serialize};

	use super::{PortPrivacy, PortProtocol};

	pub const METHOD_SET_PORTS: &str = "set_ports";

	#[derive(Serialize, Deserialize, PartialEq, Eq, Clone, Debug)]
	pub struct PortRec {
		pub number: u16,
		pub privacy: PortPrivacy,
		pub protocol: PortProtocol,
	}

	pub type PortList = Vec<PortRec>;

	#[derive(Serialize, Deserialize)]
	pub struct SetPortsParams {
		pub ports: PortList,
	}

	#[derive(Serialize, Deserialize)]
	pub struct SetPortsResponse {
		pub port_format: Option<String>,
	}
}

pub mod singleton {
	use crate::log;
	use chrono::{DateTime, Utc};
	use serde::{Deserialize, Serialize};

	pub const METHOD_RESTART: &str = "restart";
	pub const METHOD_SHUTDOWN: &str = "shutdown";
	pub const METHOD_STATUS: &str = "status";
	pub const METHOD_LOG: &str = "log";
	pub const METHOD_LOG_REPLY_DONE: &str = "log_done";

	#[derive(Serialize)]
	pub struct LogMessage<'a> {
		pub level: Option<log::Level>,
		pub prefix: &'a str,
		pub message: &'a str,
	}

	#[derive(Deserialize)]
	pub struct LogMessageOwned {
		pub level: Option<log::Level>,
		pub prefix: String,
		pub message: String,
	}

	#[derive(Serialize, Deserialize, Clone, Default)]
	pub struct StatusWithTunnelName {
		pub name: Option<String>,
		#[serde(flatten)]
		pub status: Status,
	}

	#[derive(Serialize, Deserialize, Clone)]
	pub struct Status {
		pub started_at: DateTime<Utc>,
		pub tunnel: TunnelState,
		pub last_connected_at: Option<DateTime<Utc>>,
		pub last_disconnected_at: Option<DateTime<Utc>>,
		pub last_fail_reason: Option<String>,
	}

	impl Default for Status {
		fn default() -> Self {
			Self {
				started_at: Utc::now(),
				tunnel: TunnelState::Disconnected,
				last_connected_at: None,
				last_disconnected_at: None,
				last_fail_reason: None,
			}
		}
	}

	#[derive(Deserialize, Serialize, Debug)]
	pub struct LogReplayFinished {}

	#[derive(Deserialize, Serialize, Debug, Default, Clone)]
	pub enum TunnelState {
		#[default]
		Disconnected,
		Connected,
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/tunnels/server_bridge.rs]---
Location: vscode-main/cli/src/tunnels/server_bridge.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
use super::socket_signal::{ClientMessageDecoder, ServerMessageSink};
use crate::{
	async_pipe::{get_socket_rw_stream, socket_stream_split, AsyncPipeWriteHalf},
	util::errors::AnyError,
};
use std::path::Path;
use tokio::io::{AsyncReadExt, AsyncWriteExt};

pub struct ServerBridge {
	write: AsyncPipeWriteHalf,
	decoder: ClientMessageDecoder,
}

const BUFFER_SIZE: usize = 65536;

impl ServerBridge {
	pub async fn new(
		path: &Path,
		mut target: ServerMessageSink,
		decoder: ClientMessageDecoder,
	) -> Result<Self, AnyError> {
		let stream = get_socket_rw_stream(path).await?;
		let (mut read, write) = socket_stream_split(stream);

		tokio::spawn(async move {
			let mut read_buf = vec![0; BUFFER_SIZE];
			loop {
				match read.read(&mut read_buf).await {
					Err(_) => return,
					Ok(0) => {
						let _ = target.server_closed().await;
						return; // EOF
					}
					Ok(s) => {
						let send = target.server_message(&read_buf[..s]).await;
						if send.is_err() {
							return;
						}
					}
				}
			}
		});

		Ok(ServerBridge { write, decoder })
	}

	pub async fn write(&mut self, b: Vec<u8>) -> std::io::Result<()> {
		let dec = self.decoder.decode(&b)?;
		if !dec.is_empty() {
			self.write.write_all(dec).await?;
		}
		Ok(())
	}

	pub async fn close(mut self) -> std::io::Result<()> {
		self.write.shutdown().await?;
		Ok(())
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/tunnels/server_multiplexer.rs]---
Location: vscode-main/cli/src/tunnels/server_multiplexer.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use std::sync::Arc;

use futures::future::join_all;

use crate::log;

use super::server_bridge::ServerBridge;

type Inner = Arc<std::sync::Mutex<Option<Vec<ServerBridgeRec>>>>;

struct ServerBridgeRec {
	id: u16,
	// bridge is removed when there's a write loop currently active
	bridge: Option<ServerBridge>,
	write_queue: Vec<Vec<u8>>,
}

/// The ServerMultiplexer manages multiple server bridges and allows writing
/// to them in a thread-safe way. It is copy, sync, and clone.
#[derive(Clone)]
pub struct ServerMultiplexer {
	inner: Inner,
}

impl ServerMultiplexer {
	pub fn new() -> Self {
		Self {
			inner: Arc::new(std::sync::Mutex::new(Some(Vec::new()))),
		}
	}

	/// Adds a new bridge to the multiplexer.
	pub fn register(&self, id: u16, bridge: ServerBridge) {
		let bridge_rec = ServerBridgeRec {
			id,
			bridge: Some(bridge),
			write_queue: vec![],
		};

		let mut lock = self.inner.lock().unwrap();
		match &mut *lock {
			Some(server_bridges) => (*server_bridges).push(bridge_rec),
			None => *lock = Some(vec![bridge_rec]),
		}
	}

	/// Removes a server bridge by ID.
	pub fn remove(&self, id: u16) {
		let mut lock = self.inner.lock().unwrap();
		if let Some(bridges) = &mut *lock {
			bridges.retain(|sb| sb.id != id);
		}
	}

	/// Handle an incoming server message. This is synchronous and uses a 'write loop'
	/// to ensure message order is preserved exactly, which is necessary for compression.
	/// Returns false if there was no server with the given bridge_id.
	pub fn write_message(&self, log: &log::Logger, bridge_id: u16, message: Vec<u8>) -> bool {
		let mut lock = self.inner.lock().unwrap();

		let bridges = match &mut *lock {
			Some(sb) => sb,
			None => return false,
		};

		let record = match bridges.iter_mut().find(|b| b.id == bridge_id) {
			Some(sb) => sb,
			None => return false,
		};

		record.write_queue.push(message);
		if let Some(bridge) = record.bridge.take() {
			let bridges_lock = self.inner.clone();
			let log = log.clone();
			tokio::spawn(write_loop(log, record.id, bridge, bridges_lock));
		}

		true
	}

	/// Disposes all running server bridges.
	pub async fn dispose(&self) {
		let bridges = {
			let mut lock = self.inner.lock().unwrap();
			lock.take()
		};

		let bridges = match bridges {
			Some(b) => b,
			None => return,
		};

		join_all(
			bridges
				.into_iter()
				.filter_map(|b| b.bridge)
				.map(|b| b.close()),
		)
		.await;
	}
}

/// Write loop started by `handle_server_message`. It takes the ServerBridge, and
/// runs until there's no more items in the 'write queue'. At that point, if the
/// record still exists in the bridges_lock (i.e. we haven't shut down), it'll
/// return the ServerBridge so that the next handle_server_message call starts
/// the loop again. Otherwise, it'll close the bridge.
async fn write_loop(log: log::Logger, id: u16, mut bridge: ServerBridge, bridges_lock: Inner) {
	let mut items_vec = vec![];
	loop {
		{
			let mut lock = bridges_lock.lock().unwrap();
			let server_bridges = match &mut *lock {
				Some(sb) => sb,
				None => break,
			};

			let bridge_rec = match server_bridges.iter_mut().find(|b| id == b.id) {
				Some(b) => b,
				None => break,
			};

			if bridge_rec.write_queue.is_empty() {
				bridge_rec.bridge = Some(bridge);
				return;
			}

			std::mem::swap(&mut bridge_rec.write_queue, &mut items_vec);
		}

		for item in items_vec.drain(..) {
			if let Err(e) = bridge.write(item).await {
				warning!(log, "Error writing to server: {:?}", e);
				break;
			}
		}
	}

	bridge.close().await.ok(); // got here from `break` above, meaning our record got cleared. Close the bridge if so
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/tunnels/service.rs]---
Location: vscode-main/cli/src/tunnels/service.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use std::path::{Path, PathBuf};

use async_trait::async_trait;

use crate::log;
use crate::state::LauncherPaths;
use crate::util::errors::{wrap, AnyError};
use crate::util::io::{tailf, TailEvent};

pub const SERVICE_LOG_FILE_NAME: &str = "tunnel-service.log";

#[async_trait]
pub trait ServiceContainer: Send {
	async fn run_service(
		&mut self,
		log: log::Logger,
		launcher_paths: LauncherPaths,
	) -> Result<(), AnyError>;
}

#[async_trait]
pub trait ServiceManager {
	/// Registers the current executable as a service to run with the given set
	/// of arguments.
	async fn register(&self, exe: PathBuf, args: &[&str]) -> Result<(), AnyError>;

	/// Runs the service using the given handle. The executable *must not* take
	/// any action which may fail prior to calling this to ensure service
	/// states may update.
	async fn run(
		self,
		launcher_paths: LauncherPaths,
		handle: impl 'static + ServiceContainer,
	) -> Result<(), AnyError>;

	/// Show logs from the running service to standard out.
	async fn show_logs(&self) -> Result<(), AnyError>;

	/// Gets whether the tunnel service is installed.
	async fn is_installed(&self) -> Result<bool, AnyError>;

	/// Unregisters the current executable as a service.
	async fn unregister(&self) -> Result<(), AnyError>;
}

#[cfg(target_os = "windows")]
pub type ServiceManagerImpl = super::service_windows::WindowsService;

#[cfg(target_os = "linux")]
pub type ServiceManagerImpl = super::service_linux::SystemdService;

#[cfg(target_os = "macos")]
pub type ServiceManagerImpl = super::service_macos::LaunchdService;

#[allow(unreachable_code)]
#[allow(unused_variables)]
pub fn create_service_manager(log: log::Logger, paths: &LauncherPaths) -> ServiceManagerImpl {
	#[cfg(target_os = "macos")]
	{
		super::service_macos::LaunchdService::new(log, paths)
	}
	#[cfg(target_os = "windows")]
	{
		super::service_windows::WindowsService::new(log, paths)
	}
	#[cfg(target_os = "linux")]
	{
		super::service_linux::SystemdService::new(log, paths.clone())
	}
}

#[allow(dead_code)] // unused on Linux
pub(crate) async fn tail_log_file(log_file: &Path) -> Result<(), AnyError> {
	if !log_file.exists() {
		println!("The tunnel service has not started yet.");
		return Ok(());
	}

	let file = std::fs::File::open(log_file).map_err(|e| wrap(e, "error opening log file"))?;
	let mut rx = tailf(file, 20);
	while let Some(line) = rx.recv().await {
		match line {
			TailEvent::Line(l) => print!("{l}"),
			TailEvent::Reset => println!("== Tunnel service restarted =="),
			TailEvent::Err(e) => return Err(wrap(e, "error reading log file").into()),
		}
	}

	Ok(())
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/tunnels/service_linux.rs]---
Location: vscode-main/cli/src/tunnels/service_linux.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use std::{
	fs::File,
	io::{self, Write},
	path::PathBuf,
	process::Command,
};

use async_trait::async_trait;
use zbus::{dbus_proxy, zvariant, Connection};

use crate::{
	constants::{APPLICATION_NAME, PRODUCT_NAME_LONG},
	log,
	state::LauncherPaths,
	util::errors::{wrap, AnyError, DbusConnectFailedError},
};

use super::ServiceManager;

pub struct SystemdService {
	log: log::Logger,
	service_file: PathBuf,
}

impl SystemdService {
	pub fn new(log: log::Logger, paths: LauncherPaths) -> Self {
		Self {
			log,
			service_file: paths.root().join(SystemdService::service_name_string()),
		}
	}
}

impl SystemdService {
	async fn connect() -> Result<Connection, AnyError> {
		let connection = Connection::session()
			.await
			.map_err(|e| DbusConnectFailedError(e.to_string()))?;
		Ok(connection)
	}

	async fn proxy(connection: &Connection) -> Result<SystemdManagerDbusProxy<'_>, AnyError> {
		let proxy = SystemdManagerDbusProxy::new(connection)
			.await
			.map_err(|e| {
				wrap(
					e,
					"error connecting to systemd, you may need to re-run with sudo:",
				)
			})?;

		Ok(proxy)
	}

	fn service_path_string(&self) -> String {
		self.service_file.as_os_str().to_string_lossy().to_string()
	}

	fn service_name_string() -> String {
		format!("{APPLICATION_NAME}-tunnel.service")
	}
}

#[async_trait]
impl ServiceManager for SystemdService {
	async fn register(
		&self,
		exe: std::path::PathBuf,
		args: &[&str],
	) -> Result<(), crate::util::errors::AnyError> {
		let connection = SystemdService::connect().await?;
		let proxy = SystemdService::proxy(&connection).await?;

		write_systemd_service_file(&self.service_file, exe, args)
			.map_err(|e| wrap(e, "error creating service file"))?;

		proxy
			.link_unit_files(
				vec![self.service_path_string()],
				/* 'runtime only'= */ false,
				/* replace existing = */ true,
			)
			.await
			.map_err(|e| wrap(e, "error registering service"))?;

		info!(self.log, "Successfully registered service...");

		if let Err(e) = proxy.reload().await {
			warning!(self.log, "Error issuing reload(): {}", e);
		}

		// note: enablement is implicit in recent systemd version, but required for older systems
		// https://github.com/microsoft/vscode/issues/167489#issuecomment-1331222826
		proxy
			.enable_unit_files(
				vec![SystemdService::service_name_string()],
				/* 'runtime only'= */ false,
				/* replace existing = */ true,
			)
			.await
			.map_err(|e| wrap(e, "error enabling unit files for service"))?;

		info!(self.log, "Successfully enabled unit files...");

		proxy
			.start_unit(SystemdService::service_name_string(), "replace".to_string())
			.await
			.map_err(|e| wrap(e, "error starting service"))?;

		info!(self.log, "Tunnel service successfully started");

		if std::env::var("SSH_CLIENT").is_ok() || std::env::var("SSH_TTY").is_ok() {
			info!(self.log, "Tip: run `sudo loginctl enable-linger $USER` to ensure the service stays running after you disconnect.");
		}

		Ok(())
	}

	async fn is_installed(&self) -> Result<bool, AnyError> {
		let connection = SystemdService::connect().await?;
		let proxy = SystemdService::proxy(&connection).await?;
		let state = proxy
			.get_unit_file_state(SystemdService::service_name_string())
			.await;

		if let Ok(s) = state {
			Ok(s == "enabled")
		} else {
			Ok(false)
		}
	}

	async fn run(
		self,
		launcher_paths: crate::state::LauncherPaths,
		mut handle: impl 'static + super::ServiceContainer,
	) -> Result<(), crate::util::errors::AnyError> {
		handle.run_service(self.log, launcher_paths).await
	}

	async fn show_logs(&self) -> Result<(), AnyError> {
		// show the systemctl status header...
		Command::new("systemctl")
			.args([
				"--user",
				"status",
				"-n",
				"0",
				&SystemdService::service_name_string(),
			])
			.status()
			.map(|s| s.code().unwrap_or(1))
			.map_err(|e| wrap(e, "error running systemctl"))?;

		// then follow log files
		Command::new("journalctl")
			.args(["--user", "-f", "-u", &SystemdService::service_name_string()])
			.status()
			.map(|s| s.code().unwrap_or(1))
			.map_err(|e| wrap(e, "error running journalctl"))?;
		Ok(())
	}

	async fn unregister(&self) -> Result<(), crate::util::errors::AnyError> {
		let connection = SystemdService::connect().await?;
		let proxy = SystemdService::proxy(&connection).await?;

		proxy
			.stop_unit(SystemdService::service_name_string(), "replace".to_string())
			.await
			.map_err(|e| wrap(e, "error unregistering service"))?;

		info!(self.log, "Successfully stopped service...");

		proxy
			.disable_unit_files(
				vec![SystemdService::service_name_string()],
				/* 'runtime only'= */ false,
			)
			.await
			.map_err(|e| wrap(e, "error unregistering service"))?;

		info!(self.log, "Tunnel service uninstalled");

		Ok(())
	}
}

fn write_systemd_service_file(
	path: &PathBuf,
	exe: std::path::PathBuf,
	args: &[&str],
) -> io::Result<()> {
	let mut f = File::create(path)?;
	write!(
		&mut f,
		"[Unit]\n\
      Description={} Tunnel\n\
      After=network.target\n\
      StartLimitIntervalSec=0\n\
      \n\
      [Service]\n\
      Type=simple\n\
      Restart=always\n\
      RestartSec=10\n\
      ExecStart={} \"{}\"\n\
      \n\
      [Install]\n\
      WantedBy=default.target\n\
    ",
		PRODUCT_NAME_LONG,
		exe.into_os_string().to_string_lossy(),
		args.join("\" \"")
	)?;
	Ok(())
}

/// Minimal implementation of systemd types for the services we need. The full
/// definition can be found on any systemd machine with the command:
///
/// gdbus introspect --system --dest org.freedesktop.systemd1 --object-path /org/freedesktop/systemd1
///
/// See docs here: https://www.freedesktop.org/software/systemd/man/org.freedesktop.systemd1.html
#[dbus_proxy(
	interface = "org.freedesktop.systemd1.Manager",
	gen_blocking = false,
	default_service = "org.freedesktop.systemd1",
	default_path = "/org/freedesktop/systemd1"
)]
trait SystemdManagerDbus {
	#[dbus_proxy(name = "EnableUnitFiles")]
	fn enable_unit_files(
		&self,
		files: Vec<String>,
		runtime: bool,
		force: bool,
	) -> zbus::Result<(bool, Vec<(String, String, String)>)>;

	fn get_unit_file_state(&self, file: String) -> zbus::Result<String>;

	fn link_unit_files(
		&self,
		files: Vec<String>,
		runtime: bool,
		force: bool,
	) -> zbus::Result<Vec<(String, String, String)>>;

	fn disable_unit_files(
		&self,
		files: Vec<String>,
		runtime: bool,
	) -> zbus::Result<Vec<(String, String, String)>>;

	#[dbus_proxy(name = "StartUnit")]
	fn start_unit(&self, name: String, mode: String) -> zbus::Result<zvariant::OwnedObjectPath>;

	#[dbus_proxy(name = "StopUnit")]
	fn stop_unit(&self, name: String, mode: String) -> zbus::Result<zvariant::OwnedObjectPath>;

	#[dbus_proxy(name = "Reload")]
	fn reload(&self) -> zbus::Result<()>;
}
```

--------------------------------------------------------------------------------

````
