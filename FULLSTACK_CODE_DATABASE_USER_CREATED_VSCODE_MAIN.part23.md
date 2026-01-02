---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:25Z
part: 23
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 23 of 552)

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

---[FILE: cli/src/tunnels/service_macos.rs]---
Location: vscode-main/cli/src/tunnels/service_macos.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use std::{
	fs::{remove_file, File},
	io::{self, Write},
	path::{Path, PathBuf},
};

use async_trait::async_trait;

use crate::{
	constants::APPLICATION_NAME,
	log,
	state::LauncherPaths,
	util::{
		command::capture_command_and_check_status,
		errors::{wrap, AnyError, CodeError, MissingHomeDirectory},
	},
};

use super::{service::tail_log_file, ServiceManager};

pub struct LaunchdService {
	log: log::Logger,
	log_file: PathBuf,
}

impl LaunchdService {
	pub fn new(log: log::Logger, paths: &LauncherPaths) -> Self {
		Self {
			log,
			log_file: paths.service_log_file(),
		}
	}
}

#[async_trait]
impl ServiceManager for LaunchdService {
	async fn register(
		&self,
		exe: std::path::PathBuf,
		args: &[&str],
	) -> Result<(), crate::util::errors::AnyError> {
		let service_file = get_service_file_path()?;
		write_service_file(&service_file, &self.log_file, exe, args)
			.map_err(|e| wrap(e, "error creating service file"))?;

		info!(self.log, "Successfully registered service...");

		capture_command_and_check_status(
			"launchctl",
			&["load", service_file.as_os_str().to_string_lossy().as_ref()],
		)
		.await?;

		capture_command_and_check_status("launchctl", &["start", &get_service_label()]).await?;

		info!(self.log, "Tunnel service successfully started");

		Ok(())
	}

	async fn show_logs(&self) -> Result<(), AnyError> {
		tail_log_file(&self.log_file).await
	}

	async fn run(
		self,
		launcher_paths: crate::state::LauncherPaths,
		mut handle: impl 'static + super::ServiceContainer,
	) -> Result<(), crate::util::errors::AnyError> {
		handle.run_service(self.log, launcher_paths).await
	}

	async fn is_installed(&self) -> Result<bool, AnyError> {
		let cmd = capture_command_and_check_status("launchctl", &["list"]).await?;
		Ok(String::from_utf8_lossy(&cmd.stdout).contains(&get_service_label()))
	}

	async fn unregister(&self) -> Result<(), crate::util::errors::AnyError> {
		let service_file = get_service_file_path()?;

		match capture_command_and_check_status("launchctl", &["stop", &get_service_label()]).await {
			Ok(_) => {}
			// status 3 == "no such process"
			Err(CodeError::CommandFailed { code: 3, .. }) => {}
			Err(e) => return Err(wrap(e, "error stopping service").into()),
		};

		info!(self.log, "Successfully stopped service...");

		capture_command_and_check_status(
			"launchctl",
			&[
				"unload",
				service_file.as_os_str().to_string_lossy().as_ref(),
			],
		)
		.await?;

		info!(self.log, "Tunnel service uninstalled");

		if let Ok(f) = get_service_file_path() {
			remove_file(f).ok();
		}

		Ok(())
	}
}

fn get_service_label() -> String {
	format!("com.visualstudio.{}.tunnel", APPLICATION_NAME)
}

fn get_service_file_path() -> Result<PathBuf, MissingHomeDirectory> {
	match dirs::home_dir() {
		Some(mut d) => {
			d.push(format!("{}.plist", get_service_label()));
			Ok(d)
		}
		None => Err(MissingHomeDirectory()),
	}
}

fn write_service_file(
	path: &PathBuf,
	log_file: &Path,
	exe: std::path::PathBuf,
	args: &[&str],
) -> io::Result<()> {
	let mut f = File::create(path)?;
	let log_file = log_file.as_os_str().to_string_lossy();
	// todo: we may be able to skip file logging and use the ASL instead
	// if/when we no longer need to support older macOS versions.
	write!(
		&mut f,
		"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n\
		<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">\n\
		<plist version=\"1.0\">\n\
		<dict>\n\
			<key>Label</key>\n\
			<string>{}</string>\n\
			<key>LimitLoadToSessionType</key>\n\
			<string>Aqua</string>\n\
			<key>ProgramArguments</key>\n\
			<array>\n\
				<string>{}</string>\n\
				<string>{}</string>\n\
			</array>\n\
			<key>KeepAlive</key>\n\
			<true/>\n\
			<key>StandardErrorPath</key>\n\
			<string>{}</string>\n\
			<key>StandardOutPath</key>\n\
			<string>{}</string>\n\
		</dict>\n\
		</plist>",
		get_service_label(),
		exe.into_os_string().to_string_lossy(),
		args.join("</string><string>"),
		log_file,
		log_file
	)?;
	Ok(())
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/tunnels/service_windows.rs]---
Location: vscode-main/cli/src/tunnels/service_windows.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use async_trait::async_trait;
use shell_escape::windows::escape as shell_escape;
use std::os::windows::process::CommandExt;
use std::{path::PathBuf, process::Stdio};
use winapi::um::winbase::{CREATE_NEW_PROCESS_GROUP, DETACHED_PROCESS};
use winreg::{enums::HKEY_CURRENT_USER, RegKey};

use crate::util::command::new_std_command;
use crate::{
	constants::TUNNEL_ACTIVITY_NAME,
	log,
	state::LauncherPaths,
	tunnels::{protocol, singleton_client::do_single_rpc_call},
	util::errors::{wrap, wrapdbg, AnyError},
};

use super::service::{tail_log_file, ServiceContainer, ServiceManager as CliServiceManager};

const DID_LAUNCH_AS_HIDDEN_PROCESS: &str = "VSCODE_CLI_DID_LAUNCH_AS_HIDDEN_PROCESS";

pub struct WindowsService {
	log: log::Logger,
	tunnel_lock: PathBuf,
	log_file: PathBuf,
}

impl WindowsService {
	pub fn new(log: log::Logger, paths: &LauncherPaths) -> Self {
		Self {
			log,
			tunnel_lock: paths.tunnel_lockfile(),
			log_file: paths.service_log_file(),
		}
	}

	fn open_key() -> Result<RegKey, AnyError> {
		RegKey::predef(HKEY_CURRENT_USER)
			.create_subkey(r"Software\Microsoft\Windows\CurrentVersion\Run")
			.map_err(|e| wrap(e, "error opening run registry key").into())
			.map(|(key, _)| key)
	}
}

#[async_trait]
impl CliServiceManager for WindowsService {
	async fn register(&self, exe: std::path::PathBuf, args: &[&str]) -> Result<(), AnyError> {
		let key = WindowsService::open_key()?;

		let mut reg_str = String::new();
		let mut cmd = new_std_command(&exe);
		reg_str.push_str(shell_escape(exe.to_string_lossy()).as_ref());

		let mut add_arg = |arg: &str| {
			reg_str.push(' ');
			reg_str.push_str(shell_escape((*arg).into()).as_ref());
			cmd.arg(arg);
		};

		for arg in args {
			add_arg(arg);
		}

		add_arg("--log-to-file");
		add_arg(self.log_file.to_string_lossy().as_ref());

		key.set_value(TUNNEL_ACTIVITY_NAME, &reg_str)
			.map_err(|e| AnyError::from(wrapdbg(e, "error setting registry key")))?;

		info!(self.log, "Successfully registered service...");

		cmd.stderr(Stdio::null());
		cmd.stdout(Stdio::null());
		cmd.stdin(Stdio::null());
		cmd.creation_flags(CREATE_NEW_PROCESS_GROUP | DETACHED_PROCESS);
		cmd.spawn()
			.map_err(|e| wrapdbg(e, "error starting service"))?;

		info!(self.log, "Tunnel service successfully started");
		Ok(())
	}

	async fn show_logs(&self) -> Result<(), AnyError> {
		tail_log_file(&self.log_file).await
	}

	async fn run(
		self,
		launcher_paths: LauncherPaths,
		mut handle: impl 'static + ServiceContainer,
	) -> Result<(), AnyError> {
		if std::env::var(DID_LAUNCH_AS_HIDDEN_PROCESS).is_ok() {
			return handle.run_service(self.log, launcher_paths).await;
		}

		// Start as a hidden subprocess to avoid showing cmd.exe on startup.
		// Fixes https://github.com/microsoft/vscode/issues/184058
		// I also tried the winapi ShowWindow, but that didn't yield fruit.
		new_std_command(std::env::current_exe().unwrap())
			.args(std::env::args().skip(1))
			.env(DID_LAUNCH_AS_HIDDEN_PROCESS, "1")
			.stderr(Stdio::null())
			.stdout(Stdio::null())
			.stdin(Stdio::null())
			.creation_flags(CREATE_NEW_PROCESS_GROUP | DETACHED_PROCESS)
			.spawn()
			.map_err(|e| wrap(e, "error starting nested process"))?;

		Ok(())
	}

	async fn is_installed(&self) -> Result<bool, AnyError> {
		let key = WindowsService::open_key()?;
		Ok(key.get_raw_value(TUNNEL_ACTIVITY_NAME).is_ok())
	}

	async fn unregister(&self) -> Result<(), AnyError> {
		let key = WindowsService::open_key()?;
		match key.delete_value(TUNNEL_ACTIVITY_NAME) {
			Ok(_) => {}
			Err(e) if e.kind() == std::io::ErrorKind::NotFound => {}
			Err(e) => return Err(wrap(e, "error deleting registry key").into()),
		}

		info!(self.log, "Tunnel service uninstalled");

		let r = do_single_rpc_call::<_, ()>(
			&self.tunnel_lock,
			self.log.clone(),
			protocol::singleton::METHOD_SHUTDOWN,
			protocol::EmptyObject {},
		)
		.await;

		if r.is_err() {
			warning!(self.log, "The tunnel service has been unregistered, but we couldn't find a running tunnel process. You may need to restart or log out and back in to fully stop the tunnel.");
		} else {
			info!(self.log, "Successfully shut down running tunnel.");
		}

		Ok(())
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/tunnels/shutdown_signal.rs]---
Location: vscode-main/cli/src/tunnels/shutdown_signal.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use futures::{stream::FuturesUnordered, StreamExt};
use std::{fmt, path::PathBuf};
use sysinfo::Pid;

use crate::util::{
	machine::{wait_until_exe_deleted, wait_until_process_exits},
	sync::{new_barrier, Barrier, Receivable},
};

/// Describes the signal to manully stop the server
#[derive(Copy, Clone)]
pub enum ShutdownSignal {
	CtrlC,
	ParentProcessKilled(Pid),
	ExeUninstalled,
	ServiceStopped,
	RpcShutdownRequested,
	RpcRestartRequested,
}

impl fmt::Display for ShutdownSignal {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		match self {
			ShutdownSignal::CtrlC => write!(f, "Ctrl-C received"),
			ShutdownSignal::ParentProcessKilled(p) => {
				write!(f, "Parent process {p} no longer exists")
			}
			ShutdownSignal::ExeUninstalled => {
				write!(f, "Executable no longer exists")
			}
			ShutdownSignal::ServiceStopped => write!(f, "Service stopped"),
			ShutdownSignal::RpcShutdownRequested => write!(f, "RPC client requested shutdown"),
			ShutdownSignal::RpcRestartRequested => {
				write!(f, "RPC client requested a tunnel restart")
			}
		}
	}
}

pub enum ShutdownRequest {
	CtrlC,
	ParentProcessKilled(Pid),
	ExeUninstalled(PathBuf),
	Derived(Box<dyn Receivable<ShutdownSignal> + Send>),
}

impl ShutdownRequest {
	async fn wait(self) -> Option<ShutdownSignal> {
		match self {
			ShutdownRequest::CtrlC => {
				let ctrl_c = tokio::signal::ctrl_c();
				ctrl_c.await.ok();
				Some(ShutdownSignal::CtrlC)
			}
			ShutdownRequest::ParentProcessKilled(pid) => {
				wait_until_process_exits(pid, 2000).await;
				Some(ShutdownSignal::ParentProcessKilled(pid))
			}
			ShutdownRequest::ExeUninstalled(exe_path) => {
				wait_until_exe_deleted(&exe_path, 2000).await;
				Some(ShutdownSignal::ExeUninstalled)
			}
			ShutdownRequest::Derived(mut rx) => rx.recv_msg().await,
		}
	}
	/// Creates a receiver channel sent to once any of the signals are received.
	/// Note: does not handle ServiceStopped
	pub fn create_rx(
		signals: impl IntoIterator<Item = ShutdownRequest>,
	) -> Barrier<ShutdownSignal> {
		let (barrier, opener) = new_barrier();
		let futures = signals
			.into_iter()
			.map(|s| s.wait())
			.collect::<FuturesUnordered<_>>();

		tokio::spawn(async move {
			if let Some(s) = futures.filter_map(futures::future::ready).next().await {
				opener.open(s);
			}
		});

		barrier
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/tunnels/singleton_client.rs]---
Location: vscode-main/cli/src/tunnels/singleton_client.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use std::{
	path::Path,
	sync::{
		atomic::{AtomicBool, Ordering},
		Arc,
	},
	thread,
};

use const_format::concatcp;
use tokio::sync::mpsc;

use crate::{
	async_pipe::{socket_stream_split, AsyncPipe},
	constants::IS_INTERACTIVE_CLI,
	json_rpc::{new_json_rpc, start_json_rpc, JsonRpcSerializer},
	log,
	rpc::RpcCaller,
	singleton::connect_as_client,
	tunnels::{code_server::print_listening, protocol::EmptyObject},
	util::{errors::CodeError, sync::Barrier},
};

use super::{
	protocol,
	shutdown_signal::{ShutdownRequest, ShutdownSignal},
};

pub struct SingletonClientArgs {
	pub log: log::Logger,
	pub stream: AsyncPipe,
	pub shutdown: Barrier<ShutdownSignal>,
}

struct SingletonServerContext {
	log: log::Logger,
	exit_entirely: Arc<AtomicBool>,
	caller: RpcCaller<JsonRpcSerializer>,
}

const CONTROL_INSTRUCTIONS_COMMON: &str =
	"Connected to an existing tunnel process running on this machine.";

const CONTROL_INSTRUCTIONS_INTERACTIVE: &str = concatcp!(
	CONTROL_INSTRUCTIONS_COMMON,
	" You can press:

- \"x\" + Enter to stop the tunnel and exit
- \"r\" + Enter to restart the tunnel
- Ctrl+C to detach
"
);

/// Serves a client singleton. Returns true if the process should exit after
/// this returns, instead of trying to start a tunnel.
pub async fn start_singleton_client(args: SingletonClientArgs) -> bool {
	let mut rpc = new_json_rpc();
	let (msg_tx, msg_rx) = mpsc::unbounded_channel();
	let exit_entirely = Arc::new(AtomicBool::new(false));

	debug!(
		args.log,
		"An existing tunnel is running on this machine, connecting to it..."
	);

	if *IS_INTERACTIVE_CLI {
		let stdin_handle = rpc.get_caller(msg_tx.clone());
		thread::spawn(move || {
			let mut input = String::new();
			loop {
				input.truncate(0);
				match std::io::stdin().read_line(&mut input) {
					Err(_) | Ok(0) => return, // EOF or not a tty
					_ => {}
				};

				match input.chars().next().map(|c| c.to_ascii_lowercase()) {
					Some('x') => {
						stdin_handle.notify(protocol::singleton::METHOD_SHUTDOWN, EmptyObject {});
						return;
					}
					Some('r') => {
						stdin_handle.notify(protocol::singleton::METHOD_RESTART, EmptyObject {});
					}
					Some(_) | None => {}
				}
			}
		});
	}

	let caller = rpc.get_caller(msg_tx);
	let mut rpc = rpc.methods(SingletonServerContext {
		log: args.log.clone(),
		exit_entirely: exit_entirely.clone(),
		caller,
	});

	rpc.register_sync(protocol::singleton::METHOD_SHUTDOWN, |_: EmptyObject, c| {
		c.exit_entirely.store(true, Ordering::SeqCst);
		Ok(())
	});

	rpc.register_async(
		protocol::singleton::METHOD_LOG_REPLY_DONE,
		|_: EmptyObject, c| async move {
			c.log.result(if *IS_INTERACTIVE_CLI {
				CONTROL_INSTRUCTIONS_INTERACTIVE
			} else {
				CONTROL_INSTRUCTIONS_COMMON
			});

			let res = c
				.caller
				.call::<_, _, protocol::singleton::StatusWithTunnelName>(
					protocol::singleton::METHOD_STATUS,
					protocol::EmptyObject {},
				);

			// we want to ensure the "listening" string always gets printed for
			// consumers (i.e. VS Code). Ask for it. If the tunnel is not currently
			// connected though, it will be soon, and that'll be in the log replays.
			if let Ok(Ok(s)) = res.await {
				if let Some(name) = s.name {
					print_listening(&c.log, &name);
				}
			}

			Ok(())
		},
	);

	rpc.register_sync(
		protocol::singleton::METHOD_LOG,
		|log: protocol::singleton::LogMessageOwned, c| {
			match log.level {
				Some(level) => c.log.emit(level, &format!("{}{}", log.prefix, log.message)),
				None => c.log.result(format!("{}{}", log.prefix, log.message)),
			}
			Ok(())
		},
	);

	let (read, write) = socket_stream_split(args.stream);
	let _ = start_json_rpc(rpc.build(args.log), read, write, msg_rx, args.shutdown).await;

	exit_entirely.load(Ordering::SeqCst)
}

pub async fn do_single_rpc_call<
	P: serde::Serialize + 'static,
	R: serde::de::DeserializeOwned + Send + 'static,
>(
	lock_file: &Path,
	log: log::Logger,
	method: &'static str,
	params: P,
) -> Result<R, CodeError> {
	let client = match connect_as_client(lock_file).await {
		Ok(p) => p,
		Err(CodeError::SingletonLockfileOpenFailed(_))
		| Err(CodeError::SingletonLockedProcessExited(_)) => {
			return Err(CodeError::NoRunningTunnel);
		}
		Err(e) => return Err(e),
	};

	let (msg_tx, msg_rx) = mpsc::unbounded_channel();
	let mut rpc = new_json_rpc();
	let caller = rpc.get_caller(msg_tx);
	let (read, write) = socket_stream_split(client);

	let rpc = tokio::spawn(async move {
		start_json_rpc(
			rpc.methods(()).build(log),
			read,
			write,
			msg_rx,
			ShutdownRequest::create_rx([ShutdownRequest::CtrlC]),
		)
		.await
		.unwrap();
	});

	let r = caller.call(method, params).await.unwrap();
	rpc.abort();
	r.map_err(CodeError::TunnelRpcCallFailed)
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/tunnels/singleton_server.rs]---
Location: vscode-main/cli/src/tunnels/singleton_server.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use std::{
	pin::Pin,
	sync::{Arc, Mutex},
};

use super::{
	code_server::CodeServerArgs,
	control_server::ServerTermination,
	dev_tunnels::{ActiveTunnel, StatusLock},
	protocol,
	shutdown_signal::{ShutdownRequest, ShutdownSignal},
};
use crate::{
	async_pipe::socket_stream_split,
	json_rpc::{new_json_rpc, start_json_rpc, JsonRpcSerializer},
	log,
	rpc::{RpcCaller, RpcDispatcher},
	singleton::SingletonServer,
	state::LauncherPaths,
	tunnels::code_server::print_listening,
	update_service::Platform,
	util::{
		errors::{AnyError, CodeError},
		ring_buffer::RingBuffer,
		sync::{Barrier, ConcatReceivable},
	},
};
use futures::future::Either;
use tokio::{
	pin,
	sync::{broadcast, mpsc},
	task::JoinHandle,
};

pub struct SingletonServerArgs<'a> {
	pub server: &'a mut RpcServer,
	pub log: log::Logger,
	pub tunnel: ActiveTunnel,
	pub paths: &'a LauncherPaths,
	pub code_server_args: &'a CodeServerArgs,
	pub platform: Platform,
	pub shutdown: Barrier<ShutdownSignal>,
	pub log_broadcast: &'a BroadcastLogSink,
}

struct StatusInfo {
	name: String,
	lock: StatusLock,
}

#[derive(Clone)]
struct SingletonServerContext {
	log: log::Logger,
	shutdown_tx: broadcast::Sender<ShutdownSignal>,
	broadcast_tx: broadcast::Sender<Vec<u8>>,
	// ugly: a lock in a lock. current_status needs to be provided only
	// after we set up the tunnel, however the tunnel is created after the
	// singleton server starts to avoid a gap in singleton availability.
	// However, this should be safe, as the lock is only used for immediate
	// data reads (in the `status` method).
	current_status: Arc<Mutex<Option<StatusInfo>>>,
}

pub struct RpcServer {
	fut: JoinHandle<Result<(), CodeError>>,
	shutdown_broadcast: broadcast::Sender<ShutdownSignal>,
	current_status: Arc<Mutex<Option<StatusInfo>>>,
}

pub fn make_singleton_server(
	log_broadcast: BroadcastLogSink,
	log: log::Logger,
	server: SingletonServer,
	shutdown_rx: Barrier<ShutdownSignal>,
) -> RpcServer {
	let (shutdown_broadcast, _) = broadcast::channel(4);
	let rpc = new_json_rpc();

	let current_status = Arc::new(Mutex::default());
	let mut rpc = rpc.methods(SingletonServerContext {
		log: log.clone(),
		shutdown_tx: shutdown_broadcast.clone(),
		broadcast_tx: log_broadcast.get_brocaster(),
		current_status: current_status.clone(),
	});

	rpc.register_sync(
		protocol::singleton::METHOD_RESTART,
		|_: protocol::EmptyObject, ctx| {
			info!(ctx.log, "restarting tunnel after client request");
			let _ = ctx.shutdown_tx.send(ShutdownSignal::RpcRestartRequested);
			Ok(())
		},
	);

	rpc.register_sync(
		protocol::singleton::METHOD_STATUS,
		|_: protocol::EmptyObject, c| {
			Ok(c.current_status
				.lock()
				.unwrap()
				.as_ref()
				.map(|s| protocol::singleton::StatusWithTunnelName {
					name: Some(s.name.clone()),
					status: s.lock.read(),
				})
				.unwrap_or_default())
		},
	);

	rpc.register_sync(
		protocol::singleton::METHOD_SHUTDOWN,
		|_: protocol::EmptyObject, ctx| {
			info!(
				ctx.log,
				"closing tunnel and all clients after a shutdown request"
			);
			let _ = ctx.broadcast_tx.send(RpcCaller::serialize_notify(
				&JsonRpcSerializer {},
				protocol::singleton::METHOD_SHUTDOWN,
				protocol::EmptyObject {},
			));
			let _ = ctx.shutdown_tx.send(ShutdownSignal::RpcShutdownRequested);
			Ok(())
		},
	);

	// we tokio spawn instead of keeping a future, since we want it to progress
	// even outside of the start_singleton_server loop (i.e. while the tunnel restarts)
	let fut = tokio::spawn(async move {
		serve_singleton_rpc(log_broadcast, server, rpc.build(log), shutdown_rx).await
	});
	RpcServer {
		shutdown_broadcast,
		current_status,
		fut,
	}
}

pub async fn start_singleton_server(
	args: SingletonServerArgs<'_>,
) -> Result<ServerTermination, AnyError> {
	let shutdown_rx = ShutdownRequest::create_rx([
		ShutdownRequest::Derived(Box::new(args.server.shutdown_broadcast.subscribe())),
		ShutdownRequest::Derived(Box::new(args.shutdown.clone())),
	]);

	{
		print_listening(&args.log, &args.tunnel.name);
		let mut status = args.server.current_status.lock().unwrap();
		*status = Some(StatusInfo {
			name: args.tunnel.name.clone(),
			lock: args.tunnel.status(),
		})
	}

	let serve_fut = super::serve(
		&args.log,
		args.tunnel,
		args.paths,
		args.code_server_args,
		args.platform,
		shutdown_rx,
	);

	pin!(serve_fut);

	match futures::future::select(Pin::new(&mut args.server.fut), &mut serve_fut).await {
		Either::Left((rpc_result, fut)) => {
			// the rpc server will only end as a result of a graceful shutdown, or
			// with an error. Return the result of the eventual shutdown of the
			// control server.
			rpc_result.unwrap()?;
			fut.await
		}
		Either::Right((ctrl_result, _)) => ctrl_result,
	}
}

async fn serve_singleton_rpc<C: Clone + Send + Sync + 'static>(
	log_broadcast: BroadcastLogSink,
	mut server: SingletonServer,
	dispatcher: RpcDispatcher<JsonRpcSerializer, C>,
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
		let dispatcher = dispatcher.clone();
		let msg_rx = log_broadcast.replay_and_subscribe();
		let shutdown_rx = shutdown_rx.clone();
		tokio::spawn(async move {
			let _ = start_json_rpc(dispatcher.clone(), read, write, msg_rx, shutdown_rx).await;
		});
	}
}

/// Log sink that can broadcast and replay log events. Used for transmitting
/// logs from the singleton to all clients. This should be created and injected
/// into other services, like the tunnel, before `start_singleton_server`
/// is called.
#[derive(Clone)]
pub struct BroadcastLogSink {
	recent: Arc<Mutex<RingBuffer<Vec<u8>>>>,
	tx: broadcast::Sender<Vec<u8>>,
}

impl Default for BroadcastLogSink {
	fn default() -> Self {
		Self::new()
	}
}

impl BroadcastLogSink {
	pub fn new() -> Self {
		let (tx, _) = broadcast::channel(64);
		Self {
			tx,
			recent: Arc::new(Mutex::new(RingBuffer::new(50))),
		}
	}

	pub fn get_brocaster(&self) -> broadcast::Sender<Vec<u8>> {
		self.tx.clone()
	}

	fn replay_and_subscribe(
		&self,
	) -> ConcatReceivable<Vec<u8>, mpsc::UnboundedReceiver<Vec<u8>>, broadcast::Receiver<Vec<u8>>>
	{
		let (log_replay_tx, log_replay_rx) = mpsc::unbounded_channel();

		for log in self.recent.lock().unwrap().iter() {
			let _ = log_replay_tx.send(log.clone());
		}

		let _ = log_replay_tx.send(RpcCaller::serialize_notify(
			&JsonRpcSerializer {},
			protocol::singleton::METHOD_LOG_REPLY_DONE,
			protocol::EmptyObject {},
		));

		ConcatReceivable::new(log_replay_rx, self.tx.subscribe())
	}
}

impl log::LogSink for BroadcastLogSink {
	fn write_log(&self, level: log::Level, prefix: &str, message: &str) {
		let s = JsonRpcSerializer {};
		let serialized = RpcCaller::serialize_notify(
			&s,
			protocol::singleton::METHOD_LOG,
			protocol::singleton::LogMessage {
				level: Some(level),
				prefix,
				message,
			},
		);

		let _ = self.tx.send(serialized.clone());
		self.recent.lock().unwrap().push(serialized);
	}

	fn write_result(&self, message: &str) {
		self.write_log(log::Level::Info, "", message);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/tunnels/socket_signal.rs]---
Location: vscode-main/cli/src/tunnels/socket_signal.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use serde::Serialize;
use tokio::sync::mpsc;

use crate::msgpack_rpc::MsgPackCaller;

use super::{
	protocol::{ClientRequestMethod, RefServerMessageParams, ServerClosedParams, ToClientRequest},
	server_multiplexer::ServerMultiplexer,
};

pub struct CloseReason(pub String);

pub enum SocketSignal {
	/// Signals bytes to send to the socket.
	Send(Vec<u8>),
	/// Closes the socket (e.g. as a result of an error)
	CloseWith(CloseReason),
}

impl From<Vec<u8>> for SocketSignal {
	fn from(v: Vec<u8>) -> Self {
		SocketSignal::Send(v)
	}
}

impl SocketSignal {
	pub fn from_message<T>(msg: &T) -> Self
	where
		T: Serialize + ?Sized,
	{
		SocketSignal::Send(rmp_serde::to_vec_named(msg).unwrap())
	}
}

/// todo@connor4312: cleanup once everything is moved to rpc standard interfaces
#[allow(dead_code)]
pub enum ServerMessageDestination {
	Channel(mpsc::Sender<SocketSignal>),
	Rpc(MsgPackCaller),
}

/// Struct that handling sending or closing a connected server socket.
pub struct ServerMessageSink {
	id: u16,
	tx: Option<ServerMessageDestination>,
	multiplexer: ServerMultiplexer,
	flate: Option<FlateStream<CompressFlateAlgorithm>>,
}

impl ServerMessageSink {
	pub fn new_plain(
		multiplexer: ServerMultiplexer,
		id: u16,
		tx: ServerMessageDestination,
	) -> Self {
		Self {
			tx: Some(tx),
			id,
			multiplexer,
			flate: None,
		}
	}

	pub fn new_compressed(
		multiplexer: ServerMultiplexer,
		id: u16,
		tx: ServerMessageDestination,
	) -> Self {
		Self {
			tx: Some(tx),
			id,
			multiplexer,
			flate: Some(FlateStream::new(CompressFlateAlgorithm(
				flate2::Compress::new(flate2::Compression::new(2), false),
			))),
		}
	}

	pub async fn server_closed(&mut self) -> Result<(), mpsc::error::SendError<SocketSignal>> {
		self.server_message_or_closed(None).await
	}

	pub async fn server_message(
		&mut self,
		body: &[u8],
	) -> Result<(), mpsc::error::SendError<SocketSignal>> {
		self.server_message_or_closed(Some(body)).await
	}

	async fn server_message_or_closed(
		&mut self,
		body_or_end: Option<&[u8]>,
	) -> Result<(), mpsc::error::SendError<SocketSignal>> {
		let i = self.id;
		let mut tx = self.tx.take().unwrap();

		if let Some(b) = body_or_end {
			let body = self.get_server_msg_content(b, false);
			let r =
				send_data_or_close_if_none(i, &mut tx, Some(RefServerMessageParams { i, body }))
					.await;
			self.tx = Some(tx);
			return r;
		}

		let tail = self.get_server_msg_content(&[], true);
		if !tail.is_empty() {
			let _ = send_data_or_close_if_none(
				i,
				&mut tx,
				Some(RefServerMessageParams { i, body: tail }),
			)
			.await;
		}

		let r = send_data_or_close_if_none(i, &mut tx, None).await;
		self.tx = Some(tx);
		r
	}

	pub(crate) fn get_server_msg_content<'a: 'b, 'b>(
		&'a mut self,
		body: &'b [u8],
		finish: bool,
	) -> &'b [u8] {
		if let Some(flate) = &mut self.flate {
			if let Ok(compressed) = flate.process(body, finish) {
				return compressed;
			}
		}

		body
	}
}

async fn send_data_or_close_if_none(
	i: u16,
	tx: &mut ServerMessageDestination,
	msg: Option<RefServerMessageParams<'_>>,
) -> Result<(), mpsc::error::SendError<SocketSignal>> {
	match tx {
		ServerMessageDestination::Channel(tx) => {
			tx.send(SocketSignal::from_message(&ToClientRequest {
				id: None,
				params: match msg {
					Some(msg) => ClientRequestMethod::servermsg(msg),
					None => ClientRequestMethod::serverclose(ServerClosedParams { i }),
				},
			}))
			.await
		}
		ServerMessageDestination::Rpc(caller) => {
			match msg {
				Some(msg) => caller.notify("servermsg", msg),
				None => caller.notify("serverclose", ServerClosedParams { i }),
			};
			Ok(())
		}
	}
}

impl Drop for ServerMessageSink {
	fn drop(&mut self) {
		self.multiplexer.remove(self.id);
	}
}

pub struct ClientMessageDecoder {
	dec: Option<FlateStream<DecompressFlateAlgorithm>>,
}

impl ClientMessageDecoder {
	pub fn new_plain() -> Self {
		ClientMessageDecoder { dec: None }
	}

	pub fn new_compressed() -> Self {
		ClientMessageDecoder {
			dec: Some(FlateStream::new(DecompressFlateAlgorithm(
				flate2::Decompress::new(false),
			))),
		}
	}

	pub fn decode<'a: 'b, 'b>(&'a mut self, message: &'b [u8]) -> std::io::Result<&'b [u8]> {
		match &mut self.dec {
			// todo@connor4312 do we ever need to actually 'finish' the client message stream?
			Some(d) => d.process(message, false),
			None => Ok(message),
		}
	}
}

trait FlateAlgorithm {
	fn total_in(&self) -> u64;
	fn total_out(&self) -> u64;
	fn process(
		&mut self,
		contents: &[u8],
		output: &mut [u8],
		finish: bool,
	) -> Result<flate2::Status, std::io::Error>;
}

struct DecompressFlateAlgorithm(flate2::Decompress);

impl FlateAlgorithm for DecompressFlateAlgorithm {
	fn total_in(&self) -> u64 {
		self.0.total_in()
	}

	fn total_out(&self) -> u64 {
		self.0.total_out()
	}

	fn process(
		&mut self,
		contents: &[u8],
		output: &mut [u8],
		finish: bool,
	) -> Result<flate2::Status, std::io::Error> {
		let mode = match finish {
			true => flate2::FlushDecompress::Finish,
			false => flate2::FlushDecompress::None,
		};

		self.0
			.decompress(contents, output, mode)
			.map_err(|e| std::io::Error::new(std::io::ErrorKind::InvalidInput, e))
	}
}

struct CompressFlateAlgorithm(flate2::Compress);

impl FlateAlgorithm for CompressFlateAlgorithm {
	fn total_in(&self) -> u64 {
		self.0.total_in()
	}

	fn total_out(&self) -> u64 {
		self.0.total_out()
	}

	fn process(
		&mut self,
		contents: &[u8],
		output: &mut [u8],
		finish: bool,
	) -> Result<flate2::Status, std::io::Error> {
		let mode = match finish {
			true => flate2::FlushCompress::Finish,
			false => flate2::FlushCompress::Sync,
		};

		self.0
			.compress(contents, output, mode)
			.map_err(|e| std::io::Error::new(std::io::ErrorKind::InvalidInput, e))
	}
}

struct FlateStream<A>
where
	A: FlateAlgorithm,
{
	flate: A,
	output: Vec<u8>,
}

impl<A> FlateStream<A>
where
	A: FlateAlgorithm,
{
	pub fn new(alg: A) -> Self {
		Self {
			flate: alg,
			output: vec![0; 4096],
		}
	}

	pub fn process(&mut self, contents: &[u8], finish: bool) -> std::io::Result<&[u8]> {
		let mut out_offset = 0;
		let mut in_offset = 0;
		loop {
			let in_before = self.flate.total_in();
			let out_before = self.flate.total_out();

			match self.flate.process(
				&contents[in_offset..],
				&mut self.output[out_offset..],
				finish,
			) {
				Ok(flate2::Status::Ok | flate2::Status::BufError) => {
					let processed_len = in_offset + (self.flate.total_in() - in_before) as usize;
					let output_len = out_offset + (self.flate.total_out() - out_before) as usize;
					if processed_len < contents.len() || output_len == self.output.len() {
						// If we filled the output buffer but there's more data to compress,
						// or the output got filled after processing all input, extend
						// the output buffer and keep compressing.
						out_offset = output_len;
						in_offset = processed_len;
						if output_len == self.output.len() {
							self.output.resize(self.output.len() * 2, 0);
						}
						continue;
					}

					return Ok(&self.output[..output_len]);
				}
				Ok(flate2::Status::StreamEnd) => {
					return Err(std::io::Error::new(
						std::io::ErrorKind::UnexpectedEof,
						"unexpected stream end",
					))
				}
				Err(e) => return Err(e),
			}
		}
	}
}

#[cfg(test)]
mod tests {
	use super::*;
	use base64::{engine::general_purpose, Engine as _};

	#[test]
	fn test_round_trips_compression() {
		let (tx, _) = mpsc::channel(1);
		let mut sink = ServerMessageSink::new_compressed(
			ServerMultiplexer::new(),
			0,
			ServerMessageDestination::Channel(tx),
		);
		let mut decompress = ClientMessageDecoder::new_compressed();

		// 3000 and 30000 test resizing the buffer
		for msg_len in [3, 30, 300, 3000, 30000] {
			let vals = (0..msg_len).map(|v| v as u8).collect::<Vec<u8>>();
			let compressed = sink.get_server_msg_content(&vals, false);
			assert_ne!(compressed, vals);
			let decompressed = decompress.decode(compressed).unwrap();
			assert_eq!(decompressed.len(), vals.len());
			assert_eq!(decompressed, vals);
		}
	}

	const TEST_191501_BUFS: [&str; 3] = [
		"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"
	];

	// Test that fixes #191501. Ensures compressed data can be streamed out correctly.
	#[test]
	fn test_flatestream_decodes_191501() {
		let mut dec = ClientMessageDecoder::new_compressed();
		let mut len = 0;
		for b in TEST_191501_BUFS {
			let b = general_purpose::STANDARD
				.decode(b)
				.expect("expected no decode error");
			let s = dec.decode(&b).expect("expected no decompress error");
			len += s.len();
		}

		assert_eq!(len, 265 + 101 + 10370);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/tunnels/wsl_detect.rs]---
Location: vscode-main/cli/src/tunnels/wsl_detect.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use crate::log;

#[cfg(not(windows))]
pub fn is_wsl_installed(_log: &log::Logger) -> bool {
	false
}

#[cfg(windows)]
pub fn is_wsl_installed(log: &log::Logger) -> bool {
	use std::path::PathBuf;

	use crate::util::command::new_std_command;

	let system32 = {
		let sys_root = match std::env::var("SystemRoot") {
			Ok(s) => s,
			Err(_) => return false,
		};

		let is_32_on_64 = std::env::var("PROCESSOR_ARCHITEW6432").is_ok();
		let mut system32 = PathBuf::from(sys_root);
		system32.push(if is_32_on_64 { "Sysnative" } else { "System32" });
		system32
	};

	// Windows builds < 22000
	let mut maybe_lxss = system32.join("lxss");
	maybe_lxss.push("LxssManager.dll");
	if maybe_lxss.exists() {
		trace!(log, "wsl availability detected via lxss");
		return true;
	}

	// Windows builds >= 22000
	let maybe_wsl = system32.join("wsl.exe");
	if maybe_wsl.exists() {
		if let Ok(s) = new_std_command(maybe_wsl).arg("--status").output() {
			if s.status.success() {
				trace!(log, "wsl availability detected via subprocess");
				return true;
			}
		}
	}

	trace!(log, "wsl not detected");

	false
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/util/app_lock.rs]---
Location: vscode-main/cli/src/util/app_lock.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

#[cfg(windows)]
use std::{io, ptr};

#[cfg(windows)]
use winapi::{
	shared::winerror::ERROR_ALREADY_EXISTS,
	um::{handleapi::CloseHandle, synchapi::CreateMutexA, winnt::HANDLE},
};

use super::errors::CodeError;

pub struct AppMutex {
	#[cfg(windows)]
	handle: HANDLE,
}

#[cfg(windows)] // handle is thread-safe, mark it so with this
unsafe impl Send for AppMutex {}

impl AppMutex {
	#[cfg(unix)]
	pub fn new(_name: &str) -> Result<Self, CodeError> {
		Ok(Self {})
	}

	#[cfg(windows)]
	pub fn new(name: &str) -> Result<Self, CodeError> {
		use std::ffi::CString;

		let cname = CString::new(name).unwrap();
		let handle = unsafe { CreateMutexA(ptr::null_mut(), 0, cname.as_ptr() as _) };

		if !handle.is_null() {
			return Ok(Self { handle });
		}

		let err = io::Error::last_os_error();
		let raw = err.raw_os_error();
		// docs report it should return ERROR_IO_PENDING, but in my testing it actually
		// returns ERROR_LOCK_VIOLATION. Or maybe winapi is wrong?
		if raw == Some(ERROR_ALREADY_EXISTS as i32) {
			return Err(CodeError::AppAlreadyLocked(name.to_string()));
		}

		Err(CodeError::AppLockFailed(err))
	}
}

impl Drop for AppMutex {
	fn drop(&mut self) {
		#[cfg(windows)]
		unsafe {
			CloseHandle(self.handle)
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/util/command.rs]---
Location: vscode-main/cli/src/util/command.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
use super::errors::CodeError;
use std::{
	borrow::Cow,
	ffi::OsStr,
	process::{Output, Stdio},
};
use tokio::process::Command;

pub async fn capture_command_and_check_status(
	command_str: impl AsRef<OsStr>,
	args: &[impl AsRef<OsStr>],
) -> Result<std::process::Output, CodeError> {
	let output = capture_command(&command_str, args).await?;

	check_output_status(output, || {
		format!(
			"{} {}",
			command_str.as_ref().to_string_lossy(),
			args.iter()
				.map(|a| a.as_ref().to_string_lossy())
				.collect::<Vec<Cow<'_, str>>>()
				.join(" ")
		)
	})
}

pub fn check_output_status(
	output: Output,
	cmd_str: impl FnOnce() -> String,
) -> Result<std::process::Output, CodeError> {
	if !output.status.success() {
		return Err(CodeError::CommandFailed {
			command: cmd_str(),
			code: output.status.code().unwrap_or(-1),
			output: String::from_utf8_lossy(if output.stderr.is_empty() {
				&output.stdout
			} else {
				&output.stderr
			})
			.into(),
		});
	}

	Ok(output)
}

pub async fn capture_command<A, I, S>(
	command_str: A,
	args: I,
) -> Result<std::process::Output, CodeError>
where
	A: AsRef<OsStr>,
	I: IntoIterator<Item = S>,
	S: AsRef<OsStr>,
{
	new_tokio_command(&command_str)
		.args(args)
		.stdin(Stdio::null())
		.stdout(Stdio::piped())
		.output()
		.await
		.map_err(|e| CodeError::CommandFailed {
			command: command_str.as_ref().to_string_lossy().to_string(),
			code: -1,
			output: e.to_string(),
		})
}

/// Makes a new Command, setting flags to avoid extra windows on win32
#[cfg(windows)]
pub fn new_tokio_command(exe: impl AsRef<OsStr>) -> Command {
	let mut p = tokio::process::Command::new(exe);
	p.creation_flags(winapi::um::winbase::CREATE_NO_WINDOW);
	p
}

/// Makes a new Command, setting flags to avoid extra windows on win32
#[cfg(not(windows))]
pub fn new_tokio_command(exe: impl AsRef<OsStr>) -> Command {
	tokio::process::Command::new(exe)
}

/// Makes a new command to run the target script. For windows, ensures it's run
/// in a cmd.exe context.
#[cfg(windows)]
pub fn new_script_command(script: impl AsRef<OsStr>) -> Command {
	let mut cmd = new_tokio_command("cmd");
	cmd.arg("/Q");
	cmd.arg("/C");
	cmd.arg(script);
	cmd
}

/// Makes a new command to run the target script. For windows, ensures it's run
/// in a cmd.exe context.
#[cfg(not(windows))]
pub fn new_script_command(script: impl AsRef<OsStr>) -> Command {
	new_tokio_command(script) // it's assumed scripts are already +x and don't need extra handling
}

/// Makes a new Command, setting flags to avoid extra windows on win32
#[cfg(windows)]
pub fn new_std_command(exe: impl AsRef<OsStr>) -> std::process::Command {
	let mut p = std::process::Command::new(exe);
	std::os::windows::process::CommandExt::creation_flags(
		&mut p,
		winapi::um::winbase::CREATE_NO_WINDOW,
	);
	p
}

/// Makes a new Command, setting flags to avoid extra windows on win32
#[cfg(not(windows))]
pub fn new_std_command(exe: impl AsRef<OsStr>) -> std::process::Command {
	std::process::Command::new(exe)
}

/// Kills and processes and all of its children.
#[cfg(windows)]
pub async fn kill_tree(process_id: u32) -> Result<(), CodeError> {
	capture_command("taskkill", &["/t", "/pid", &process_id.to_string()]).await?;
	Ok(())
}

/// Kills and processes and all of its children.
#[cfg(not(windows))]
pub async fn kill_tree(process_id: u32) -> Result<(), CodeError> {
	use futures::future::join_all;
	use tokio::io::{AsyncBufReadExt, BufReader};

	async fn kill_single_pid(process_id_str: String) {
		capture_command("kill", &[&process_id_str]).await.ok();
	}

	// Rusty version of https://github.com/microsoft/vscode-js-debug/blob/main/src/targets/node/terminateProcess.sh

	let parent_id = process_id.to_string();
	let mut prgrep_cmd = Command::new("pgrep")
		.arg("-P")
		.arg(&parent_id)
		.stdin(Stdio::null())
		.stdout(Stdio::piped())
		.spawn()
		.map_err(|e| CodeError::CommandFailed {
			command: format!("pgrep -P {parent_id}"),
			code: -1,
			output: e.to_string(),
		})?;

	let mut kill_futures = vec![tokio::spawn(
		async move { kill_single_pid(parent_id).await },
	)];

	if let Some(stdout) = prgrep_cmd.stdout.take() {
		let mut reader = BufReader::new(stdout).lines();
		while let Some(line) = reader.next_line().await.unwrap_or(None) {
			kill_futures.push(tokio::spawn(async move { kill_single_pid(line).await }))
		}
	}

	join_all(kill_futures).await;
	prgrep_cmd.kill().await.ok();
	Ok(())
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/util/errors.rs]---
Location: vscode-main/cli/src/util/errors.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
use crate::{
	constants::{APPLICATION_NAME, CONTROL_PORT, DOCUMENTATION_URL, QUALITYLESS_PRODUCT_NAME},
	rpc::ResponseError,
};
use std::fmt::Display;
use thiserror::Error;

// Wraps another error with additional info.
#[derive(Debug, Clone)]
pub struct WrappedError {
	message: String,
	original: String,
}

impl std::fmt::Display for WrappedError {
	fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
		write!(f, "{}: {}", self.message, self.original)
	}
}

impl std::error::Error for WrappedError {
	fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
		None
	}
}

impl WrappedError {
	// fn new(original: Box<dyn std::error::Error>, message: String) -> WrappedError {
	//     WrappedError { message, original }
	// }
}

impl From<reqwest::Error> for WrappedError {
	fn from(e: reqwest::Error) -> WrappedError {
		WrappedError {
			message: format!(
				"error requesting {}",
				e.url().map_or("<unknown>", |u| u.as_str())
			),
			original: format!("{e}"),
		}
	}
}

pub fn wrapdbg<T, S>(original: T, message: S) -> WrappedError
where
	T: std::fmt::Debug,
	S: Into<String>,
{
	WrappedError {
		message: message.into(),
		original: format!("{original:?}"),
	}
}

pub fn wrap<T, S>(original: T, message: S) -> WrappedError
where
	T: Display,
	S: Into<String>,
{
	WrappedError {
		message: message.into(),
		original: format!("{original}"),
	}
}

// Error generated by an unsuccessful HTTP response
#[derive(Debug)]
pub struct StatusError {
	pub url: String,
	pub status_code: u16,
	pub body: String,
}

impl std::fmt::Display for StatusError {
	fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
		write!(
			f,
			"error requesting {}: {} {}",
			self.url, self.status_code, self.body
		)
	}
}

impl StatusError {
	pub async fn from_res(res: reqwest::Response) -> Result<StatusError, AnyError> {
		let status_code = res.status().as_u16();
		let url = res.url().to_string();
		let body = res.text().await.map_err(|e| {
			wrap(
				e,
				format!("failed to read response body on {status_code} code from {url}"),
			)
		})?;

		Ok(StatusError {
			url,
			status_code,
			body,
		})
	}
}

// When the provided connection token doesn't match the one used to set up the original VS Code Server
// This is most likely due to a new user joining.
#[derive(Debug)]
pub struct MismatchConnectionToken(pub String);

impl std::fmt::Display for MismatchConnectionToken {
	fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
		write!(f, "{}", self.0)
	}
}

// When the VS Code server has an unrecognized extension (rather than zip or gz)
#[derive(Debug)]
pub struct InvalidServerExtensionError(pub String);

impl std::fmt::Display for InvalidServerExtensionError {
	fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
		write!(f, "invalid server extension '{}'", self.0)
	}
}

// When the tunnel fails to open
#[derive(Debug, Clone)]
pub struct DevTunnelError(pub String);

impl std::fmt::Display for DevTunnelError {
	fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
		write!(f, "could not open tunnel: {}", self.0)
	}
}

impl std::error::Error for DevTunnelError {
	fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
		None
	}
}

// When the server was downloaded, but the entrypoint scripts don't exist.
#[derive(Debug)]
pub struct MissingEntrypointError();

impl std::fmt::Display for MissingEntrypointError {
	fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
		write!(f, "Missing entrypoints in server download. Most likely this is a corrupted download. Please retry")
	}
}

#[derive(Debug)]
pub struct SetupError(pub String);

impl std::fmt::Display for SetupError {
	fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
		write!(
			f,
			"{}\n\nMore info at {}/remote/linux",
			DOCUMENTATION_URL.unwrap_or("<docs>"),
			self.0
		)
	}
}

#[derive(Debug)]
pub struct NoHomeForLauncherError();

impl std::fmt::Display for NoHomeForLauncherError {
	fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
		write!(
            f,
            "No $HOME variable was found in your environment. Either set it, or specify a `--data-dir` manually when invoking the launcher.",
        )
	}
}

#[derive(Debug)]
pub struct InvalidTunnelName(pub String);

impl std::fmt::Display for InvalidTunnelName {
	fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
		write!(f, "{}", &self.0)
	}
}

#[derive(Debug)]
pub struct TunnelCreationFailed(pub String, pub String);

impl std::fmt::Display for TunnelCreationFailed {
	fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
		write!(
			f,
			"Could not create tunnel with name: {}\nReason: {}",
			&self.0, &self.1
		)
	}
}

#[derive(Debug)]
pub struct TunnelHostFailed(pub String);

impl std::fmt::Display for TunnelHostFailed {
	fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
		write!(f, "{}", &self.0)
	}
}

#[derive(Debug)]
pub struct ExtensionInstallFailed(pub String);

impl std::fmt::Display for ExtensionInstallFailed {
	fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
		write!(f, "Extension install failed: {}", &self.0)
	}
}

#[derive(Debug)]
pub struct MismatchedLaunchModeError();

impl std::fmt::Display for MismatchedLaunchModeError {
	fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
		write!(f, "A server is already running, but it was not launched in the same listening mode (port vs. socket) as this request")
	}
}

#[derive(Debug)]
pub struct NoAttachedServerError();

impl std::fmt::Display for NoAttachedServerError {
	fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
		write!(f, "No server is running")
	}
}

#[derive(Debug)]
pub struct RefreshTokenNotAvailableError();

impl std::fmt::Display for RefreshTokenNotAvailableError {
	fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
		write!(f, "Refresh token not available, authentication is required")
	}
}

#[derive(Debug)]
pub struct NoInstallInUserProvidedPath(pub String);

impl std::fmt::Display for NoInstallInUserProvidedPath {
	fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
		write!(
            f,
            "No {} installation could be found in {}. You can run `{} --use-quality=stable` to switch to the latest stable version of {}.",
						QUALITYLESS_PRODUCT_NAME,
            self.0,
						APPLICATION_NAME,
						QUALITYLESS_PRODUCT_NAME
        )
	}
}

#[derive(Debug)]
pub struct InvalidRequestedVersion();

impl std::fmt::Display for InvalidRequestedVersion {
	fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
		write!(
            f,
            "The reqested version is invalid, expected one of 'stable', 'insiders', version number (x.y.z), or absolute path.",
        )
	}
}

#[derive(Debug)]
pub struct UserCancelledInstallation();

impl std::fmt::Display for UserCancelledInstallation {
	fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
		write!(f, "Installation aborted.")
	}
}

#[derive(Debug)]
pub struct CannotForwardControlPort();

impl std::fmt::Display for CannotForwardControlPort {
	fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
		write!(f, "Cannot forward or unforward port {CONTROL_PORT}.")
	}
}

#[derive(Debug)]
pub struct ServerHasClosed();

impl std::fmt::Display for ServerHasClosed {
	fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
		write!(f, "Request cancelled because the server has closed")
	}
}

#[derive(Debug)]
pub struct ServiceAlreadyRegistered();

impl std::fmt::Display for ServiceAlreadyRegistered {
	fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
		write!(f, "Already registered the service. Run `{APPLICATION_NAME} tunnel service uninstall` to unregister it first")
	}
}

#[derive(Debug)]
pub struct WindowsNeedsElevation(pub String);

impl std::fmt::Display for WindowsNeedsElevation {
	fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
		writeln!(f, "{}", self.0)?;
		writeln!(f)?;
		writeln!(f, "You may need to run this command as an administrator:")?;
		writeln!(f, " 1. Open the start menu and search for Powershell")?;
		writeln!(f, " 2. Right click and 'Run as administrator'")?;
		if let Ok(exe) = std::env::current_exe() {
			writeln!(
				f,
				" 3. Run &'{}' '{}'",
				exe.display(),
				std::env::args().skip(1).collect::<Vec<_>>().join("' '")
			)
		} else {
			writeln!(f, " 3. Run the same command again",)
		}
	}
}

#[derive(Debug)]
pub struct InvalidRpcDataError(pub String);

impl std::fmt::Display for InvalidRpcDataError {
	fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
		write!(f, "parse error: {}", self.0)
	}
}

#[derive(Debug)]
pub struct CorruptDownload(pub String);

impl std::fmt::Display for CorruptDownload {
	fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
		write!(
			f,
			"Error updating the {} CLI: {}",
			QUALITYLESS_PRODUCT_NAME, self.0
		)
	}
}

#[derive(Debug)]
pub struct MissingHomeDirectory();

impl std::fmt::Display for MissingHomeDirectory {
	fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
		write!(f, "Could not find your home directory. Please ensure this command is running in the context of an normal user.")
	}
}

#[derive(Debug)]
pub struct OAuthError {
	pub error: String,
	pub error_description: Option<String>,
}

impl std::fmt::Display for OAuthError {
	fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
		write!(
			f,
			"Error getting authorization: {} {}",
			self.error,
			self.error_description.as_deref().unwrap_or("")
		)
	}
}

// Makes an "AnyError" enum that contains any of the given errors, in the form
// `enum AnyError { FooError(FooError) }` (when given `makeAnyError!(FooError)`).
// Useful to easily deal with application error types without making tons of "From"
// clauses.
macro_rules! makeAnyError {
    ($($e:ident),*) => {

        #[derive(Debug)]
        #[allow(clippy::enum_variant_names)]
        pub enum AnyError {
            $($e($e),)*
        }

        impl std::fmt::Display for AnyError {
            fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
                match *self {
                    $(AnyError::$e(ref e) => e.fmt(f),)*
                }
            }
        }

        impl std::error::Error for AnyError {
            fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
                None
            }
        }

        $(impl From<$e> for AnyError {
            fn from(e: $e) -> AnyError {
                AnyError::$e(e)
            }
        })*
    };
}

#[derive(Debug)]
pub struct DbusConnectFailedError(pub String);

impl Display for DbusConnectFailedError {
	fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
		let mut str = String::new();
		str.push_str("Error creating dbus session. This command uses systemd for managing services, you should check that systemd is installed and under your user.");

		if std::env::var("WSL_DISTRO_NAME").is_ok() {
			str.push_str("\n\nTo enable systemd on WSL, check out: https://devblogs.microsoft.com/commandline/systemd-support-is-now-available-in-wsl/.\n\n");
		}

		str.push_str("If running `systemctl status` works, systemd is ok, but your session dbus may not be. You might need to:\n\n- Install the `dbus-user-session` package, and reboot if it was not installed\n- Start the user dbus session with `systemctl --user enable dbus --now`.\n\nThe error encountered was: ");
		str.push_str(&self.0);
		str.push('\n');

		write!(f, "{str}")
	}
}

/// Internal errors in the VS Code CLI.
/// Note: other error should be migrated to this type gradually
#[derive(Error, Debug)]
pub enum CodeError {
	#[error("could not connect to socket/pipe: {0:?}")]
	AsyncPipeFailed(std::io::Error),
	#[error("could not listen on socket/pipe: {0:?}")]
	AsyncPipeListenerFailed(std::io::Error),
	#[error("could not create singleton lock file: {0:?}")]
	SingletonLockfileOpenFailed(std::io::Error),
	#[error("could not read singleton lock file: {0:?}")]
	SingletonLockfileReadFailed(rmp_serde::decode::Error),
	#[error("the process holding the singleton lock file (pid={0}) exited")]
	SingletonLockedProcessExited(u32),
	#[error("no tunnel process is currently running")]
	NoRunningTunnel,
	#[error("rpc call failed: {0:?}")]
	TunnelRpcCallFailed(ResponseError),
	#[cfg(windows)]
	#[error("the windows app lock {0} already exists")]
	AppAlreadyLocked(String),
	#[cfg(windows)]
	#[error("could not get windows app lock: {0:?}")]
	AppLockFailed(std::io::Error),
	#[error("failed to run command \"{command}\" (code {code}): {output}")]
	CommandFailed {
		command: String,
		code: i32,
		output: String,
	},

	#[error("platform not currently supported: {0}")]
	UnsupportedPlatform(String),
	#[error("This machine does not meet {name}'s prerequisites, expected either...\n{bullets}")]
	PrerequisitesFailed { name: &'static str, bullets: String },
	#[error("failed to spawn process: {0:?}")]
	ProcessSpawnFailed(std::io::Error),
	#[error("failed to handshake spawned process: {0:?}")]
	ProcessSpawnHandshakeFailed(std::io::Error),
	#[error("download appears corrupted, please retry ({0})")]
	CorruptDownload(&'static str),
	#[error("port forwarding is not available in this context")]
	PortForwardingNotAvailable,
	#[error("'auth' call required")]
	ServerAuthRequired,
	#[error("challenge not yet issued")]
	AuthChallengeNotIssued,
	#[error("challenge token is invalid")]
	AuthChallengeBadToken,
	#[error("unauthorized client refused")]
	AuthMismatch,
	#[error("keyring communication timed out after 5s")]
	KeyringTimeout,
	#[error("no host is connected to the tunnel relay")]
	NoTunnelEndpoint,
	#[error("could not parse `host`: {0}")]
	InvalidHostAddress(std::net::AddrParseError),
	#[error("could not start server on the given host/port: {0}")]
	CouldNotListenOnInterface(hyper::Error),
	#[error(
		"Run this command again with --accept-server-license-terms to indicate your agreement."
	)]
	NeedsInteractiveLegalConsent,
	#[error("Sorry, you cannot use this CLI without accepting the terms.")]
	DeniedLegalConset,
	#[error("The server is not yet downloaded, try again shortly.")]
	ServerNotYetDownloaded,
	#[error("An error was encountered downloading the server, please retry: {0}")]
	ServerDownloadError(String),
	#[error("Updates are are not available: {0}")]
	UpdatesNotConfigured(&'static str),
	// todo: can be specialized when update service is moved to CodeErrors
	#[error("Could not check for update: {0}")]
	UpdateCheckFailed(String),
	#[error("Could not read connection token file: {0}")]
	CouldNotReadConnectionTokenFile(std::io::Error),
	#[error("Could not write connection token file: {0}")]
	CouldNotCreateConnectionTokenFile(std::io::Error),
	#[error("A tunnel with the name {0} exists and is in-use. Please pick a different name or stop the existing tunnel.")]
	TunnelActiveAndInUse(String),
	#[error("Timed out looking for port/socket")]
	ServerOriginTimeout,
	#[error("Server exited without writing port/socket: {0}")]
	ServerUnexpectedExit(String),
}

makeAnyError!(
	MismatchConnectionToken,
	DevTunnelError,
	StatusError,
	WrappedError,
	InvalidServerExtensionError,
	MissingEntrypointError,
	SetupError,
	NoHomeForLauncherError,
	TunnelCreationFailed,
	TunnelHostFailed,
	InvalidTunnelName,
	ExtensionInstallFailed,
	MismatchedLaunchModeError,
	NoAttachedServerError,
	RefreshTokenNotAvailableError,
	NoInstallInUserProvidedPath,
	UserCancelledInstallation,
	InvalidRequestedVersion,
	CannotForwardControlPort,
	ServerHasClosed,
	ServiceAlreadyRegistered,
	WindowsNeedsElevation,
	CorruptDownload,
	MissingHomeDirectory,
	OAuthError,
	InvalidRpcDataError,
	CodeError,
	DbusConnectFailedError
);

impl From<reqwest::Error> for AnyError {
	fn from(e: reqwest::Error) -> AnyError {
		AnyError::WrappedError(WrappedError::from(e))
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/util/file_lock.rs]---
Location: vscode-main/cli/src/util/file_lock.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use crate::util::errors::CodeError;
use std::{fs::File, io};

pub struct FileLock {
	file: File,
	#[cfg(windows)]
	overlapped: winapi::um::minwinbase::OVERLAPPED,
}

#[cfg(windows)] // overlapped is thread-safe, mark it so with this
unsafe impl Send for FileLock {}

pub enum Lock {
	Acquired(FileLock),
	AlreadyLocked(File),
}

/// Number of locked bytes in the file. On Windows, locking prevents reads,
/// but consumers of the lock may still want to read what the locking file
/// as written. Thus, only PREFIX_LOCKED_BYTES are locked, and any globally-
/// readable content should be written after the prefix.
#[cfg(windows)]
pub const PREFIX_LOCKED_BYTES: usize = 1;

#[cfg(unix)]
pub const PREFIX_LOCKED_BYTES: usize = 0;

impl FileLock {
	#[cfg(windows)]
	pub fn acquire(file: File) -> Result<Lock, CodeError> {
		use std::os::windows::prelude::AsRawHandle;
		use winapi::{
			shared::winerror::{ERROR_IO_PENDING, ERROR_LOCK_VIOLATION},
			um::{
				fileapi::LockFileEx,
				minwinbase::{LOCKFILE_EXCLUSIVE_LOCK, LOCKFILE_FAIL_IMMEDIATELY},
			},
		};

		let handle = file.as_raw_handle();
		let (overlapped, ok) = unsafe {
			let mut overlapped = std::mem::zeroed();
			let ok = LockFileEx(
				handle,
				LOCKFILE_EXCLUSIVE_LOCK | LOCKFILE_FAIL_IMMEDIATELY,
				0,
				PREFIX_LOCKED_BYTES as u32,
				0,
				&mut overlapped,
			);

			(overlapped, ok)
		};

		if ok != 0 {
			return Ok(Lock::Acquired(Self { file, overlapped }));
		}

		let err = io::Error::last_os_error();
		let raw = err.raw_os_error();
		// docs report it should return ERROR_IO_PENDING, but in my testing it actually
		// returns ERROR_LOCK_VIOLATION. Or maybe winapi is wrong?
		if raw == Some(ERROR_IO_PENDING as i32) || raw == Some(ERROR_LOCK_VIOLATION as i32) {
			return Ok(Lock::AlreadyLocked(file));
		}

		Err(CodeError::SingletonLockfileOpenFailed(err))
	}

	#[cfg(unix)]
	pub fn acquire(file: File) -> Result<Lock, CodeError> {
		use std::os::unix::io::AsRawFd;

		let fd = file.as_raw_fd();
		let res = unsafe { libc::flock(fd, libc::LOCK_EX | libc::LOCK_NB) };
		if res == 0 {
			return Ok(Lock::Acquired(Self { file }));
		}

		let err = io::Error::last_os_error();
		if err.kind() == io::ErrorKind::WouldBlock {
			return Ok(Lock::AlreadyLocked(file));
		}

		Err(CodeError::SingletonLockfileOpenFailed(err))
	}

	pub fn file(&self) -> &File {
		&self.file
	}

	pub fn file_mut(&mut self) -> &mut File {
		&mut self.file
	}
}

impl Drop for FileLock {
	#[cfg(windows)]
	fn drop(&mut self) {
		use std::os::windows::prelude::AsRawHandle;
		use winapi::um::fileapi::UnlockFileEx;

		unsafe {
			UnlockFileEx(
				self.file.as_raw_handle(),
				0,
				u32::MAX,
				u32::MAX,
				&mut self.overlapped,
			)
		};
	}

	#[cfg(unix)]
	fn drop(&mut self) {
		use std::os::unix::io::AsRawFd;

		unsafe { libc::flock(self.file.as_raw_fd(), libc::LOCK_UN) };
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/util/http.rs]---
Location: vscode-main/cli/src/util/http.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
use crate::{
	constants::get_default_user_agent,
	log,
	util::errors::{self, WrappedError},
};
use async_trait::async_trait;
use core::panic;
use futures::stream::TryStreamExt;
use hyper::{
	header::{HeaderName, CONTENT_LENGTH},
	http::HeaderValue,
	HeaderMap, StatusCode,
};
use serde::de::DeserializeOwned;
use std::{io, pin::Pin, str::FromStr, sync::Arc, task::Poll};
use tokio::{
	fs,
	io::{AsyncRead, AsyncReadExt},
	sync::mpsc,
};
use tokio_util::compat::FuturesAsyncReadCompatExt;

use super::{
	errors::{wrap, AnyError, StatusError},
	io::{copy_async_progress, ReadBuffer, ReportCopyProgress},
};

pub async fn download_into_file<T>(
	filename: &std::path::Path,
	progress: T,
	mut res: SimpleResponse,
) -> Result<fs::File, WrappedError>
where
	T: ReportCopyProgress,
{
	let mut file = fs::File::create(filename)
		.await
		.map_err(|e| errors::wrap(e, "failed to create file"))?;

	let content_length = res
		.headers
		.get(CONTENT_LENGTH)
		.and_then(|h| h.to_str().ok())
		.and_then(|s| s.parse::<u64>().ok())
		.unwrap_or(0);

	copy_async_progress(progress, &mut res.read, &mut file, content_length)
		.await
		.map_err(|e| errors::wrap(e, "failed to download file"))?;

	Ok(file)
}

pub struct SimpleResponse {
	pub status_code: StatusCode,
	pub headers: HeaderMap,
	pub read: Pin<Box<dyn Send + AsyncRead + 'static>>,
	pub url: Option<url::Url>,
}

impl SimpleResponse {
	pub fn url_path_basename(&self) -> Option<String> {
		self.url.as_ref().and_then(|u| {
			u.path_segments()
				.and_then(|s| s.last().map(|s| s.to_owned()))
		})
	}
}

impl SimpleResponse {
	pub fn generic_error(url: &str) -> Self {
		let (_, rx) = mpsc::unbounded_channel();
		SimpleResponse {
			url: url::Url::parse(url).ok(),
			status_code: StatusCode::INTERNAL_SERVER_ERROR,
			headers: HeaderMap::new(),
			read: Box::pin(DelegatedReader::new(rx)),
		}
	}

	/// Converts the response into a StatusError
	pub async fn into_err(mut self) -> StatusError {
		let mut body = String::new();
		self.read.read_to_string(&mut body).await.ok();

		StatusError {
			url: self
				.url
				.map(|u| u.to_string())
				.unwrap_or_else(|| "<invalid url>".to_owned()),
			status_code: self.status_code.as_u16(),
			body,
		}
	}

	/// Deserializes the response body as JSON
	pub async fn json<T: DeserializeOwned>(&mut self) -> Result<T, AnyError> {
		let mut buf = vec![];

		// ideally serde would deserialize a stream, but it does not appear that
		// is supported. reqwest itself reads and decodes separately like we do here:
		self.read
			.read_to_end(&mut buf)
			.await
			.map_err(|e| wrap(e, "error reading response"))?;

		let t = serde_json::from_slice(&buf)
			.map_err(|e| wrap(e, format!("error decoding json from {:?}", self.url)))?;

		Ok(t)
	}
}

/// *Very* simple HTTP implementation. In most cases, this will just delegate to
/// the request library on the server (i.e. `reqwest`) but it can also be used
/// to make update/download requests on the client rather than the server,
/// similar to SSH's `remote.SSH.localServerDownload` setting.
#[async_trait]
pub trait SimpleHttp {
	async fn make_request(
		&self,
		method: &'static str,
		url: String,
	) -> Result<SimpleResponse, AnyError>;
}

pub type BoxedHttp = Arc<dyn SimpleHttp + Send + Sync + 'static>;

// Implementation of SimpleHttp that uses a reqwest client.
#[derive(Clone)]
pub struct ReqwestSimpleHttp {
	client: reqwest::Client,
}

impl ReqwestSimpleHttp {
	pub fn new() -> Self {
		Self {
			client: reqwest::ClientBuilder::new()
				.user_agent(get_default_user_agent())
				.build()
				.unwrap(),
		}
	}

	pub fn with_client(client: reqwest::Client) -> Self {
		Self { client }
	}
}

impl Default for ReqwestSimpleHttp {
	fn default() -> Self {
		Self::new()
	}
}

#[async_trait]
impl SimpleHttp for ReqwestSimpleHttp {
	async fn make_request(
		&self,
		method: &'static str,
		url: String,
	) -> Result<SimpleResponse, AnyError> {
		let res = self
			.client
			.request(reqwest::Method::try_from(method).unwrap(), &url)
			.send()
			.await?;

		Ok(SimpleResponse {
			status_code: res.status(),
			headers: res.headers().clone(),
			url: Some(res.url().clone()),
			read: Box::pin(
				res.bytes_stream()
					.map_err(|e| futures::io::Error::new(futures::io::ErrorKind::Other, e))
					.into_async_read()
					.compat(),
			),
		})
	}
}

enum DelegatedHttpEvent {
	InitResponse {
		status_code: u16,
		headers: Vec<(String, String)>,
	},
	Body(Vec<u8>),
	End,
}

// Handle for a delegated request that allows manually issuing and response.
pub struct DelegatedHttpRequest {
	pub method: &'static str,
	pub url: String,
	ch: mpsc::UnboundedSender<DelegatedHttpEvent>,
}

impl DelegatedHttpRequest {
	pub fn initial_response(&self, status_code: u16, headers: Vec<(String, String)>) {
		self.ch
			.send(DelegatedHttpEvent::InitResponse {
				status_code,
				headers,
			})
			.ok();
	}

	pub fn body(&self, chunk: Vec<u8>) {
		self.ch.send(DelegatedHttpEvent::Body(chunk)).ok();
	}

	pub fn end(self) {}
}

impl Drop for DelegatedHttpRequest {
	fn drop(&mut self) {
		self.ch.send(DelegatedHttpEvent::End).ok();
	}
}

/// Implementation of SimpleHttp that allows manually controlling responses.
#[derive(Clone)]
pub struct DelegatedSimpleHttp {
	start_request: mpsc::Sender<DelegatedHttpRequest>,
	log: log::Logger,
}

impl DelegatedSimpleHttp {
	pub fn new(log: log::Logger) -> (Self, mpsc::Receiver<DelegatedHttpRequest>) {
		let (tx, rx) = mpsc::channel(4);
		(
			DelegatedSimpleHttp {
				log,
				start_request: tx,
			},
			rx,
		)
	}
}

#[async_trait]
impl SimpleHttp for DelegatedSimpleHttp {
	async fn make_request(
		&self,
		method: &'static str,
		url: String,
	) -> Result<SimpleResponse, AnyError> {
		trace!(self.log, "making delegated request to {}", url);
		let (tx, mut rx) = mpsc::unbounded_channel();
		let sent = self
			.start_request
			.send(DelegatedHttpRequest {
				method,
				url: url.clone(),
				ch: tx,
			})
			.await;

		if sent.is_err() {
			return Ok(SimpleResponse::generic_error(&url)); // sender shut down
		}

		match rx.recv().await {
			Some(DelegatedHttpEvent::InitResponse {
				status_code,
				headers,
			}) => {
				trace!(
					self.log,
					"delegated request to {} resulted in status = {}",
					url,
					status_code
				);
				let mut headers_map = HeaderMap::with_capacity(headers.len());
				for (k, v) in &headers {
					if let (Ok(key), Ok(value)) = (
						HeaderName::from_str(&k.to_lowercase()),
						HeaderValue::from_str(v),
					) {
						headers_map.insert(key, value);
					}
				}

				Ok(SimpleResponse {
					url: url::Url::parse(&url).ok(),
					status_code: StatusCode::from_u16(status_code)
						.unwrap_or(StatusCode::INTERNAL_SERVER_ERROR),
					headers: headers_map,
					read: Box::pin(DelegatedReader::new(rx)),
				})
			}
			Some(DelegatedHttpEvent::End) => Ok(SimpleResponse::generic_error(&url)),
			Some(_) => panic!("expected initresponse as first message from delegated http"),
			None => Ok(SimpleResponse::generic_error(&url)), // sender shut down
		}
	}
}

struct DelegatedReader {
	receiver: mpsc::UnboundedReceiver<DelegatedHttpEvent>,
	readbuf: ReadBuffer,
}

impl DelegatedReader {
	pub fn new(rx: mpsc::UnboundedReceiver<DelegatedHttpEvent>) -> Self {
		DelegatedReader {
			readbuf: ReadBuffer::default(),
			receiver: rx,
		}
	}
}

impl AsyncRead for DelegatedReader {
	fn poll_read(
		mut self: Pin<&mut Self>,
		cx: &mut std::task::Context<'_>,
		buf: &mut tokio::io::ReadBuf<'_>,
	) -> std::task::Poll<std::io::Result<()>> {
		if let Some((v, s)) = self.readbuf.take_data() {
			return self.readbuf.put_data(buf, v, s);
		}

		match self.receiver.poll_recv(cx) {
			Poll::Ready(Some(DelegatedHttpEvent::Body(msg))) => self.readbuf.put_data(buf, msg, 0),
			Poll::Ready(Some(_)) => Poll::Ready(Ok(())), // EOF
			Poll::Ready(None) => {
				Poll::Ready(Err(io::Error::new(io::ErrorKind::UnexpectedEof, "EOF")))
			}
			Poll::Pending => Poll::Pending,
		}
	}
}

/// Simple http implementation that falls back to delegated http if
/// making a direct reqwest fails.
pub struct FallbackSimpleHttp {
	native: ReqwestSimpleHttp,
	delegated: DelegatedSimpleHttp,
}

impl FallbackSimpleHttp {
	pub fn new(native: ReqwestSimpleHttp, delegated: DelegatedSimpleHttp) -> Self {
		FallbackSimpleHttp { native, delegated }
	}

	pub fn native(&self) -> ReqwestSimpleHttp {
		self.native.clone()
	}

	pub fn delegated(&self) -> DelegatedSimpleHttp {
		self.delegated.clone()
	}
}

#[async_trait]
impl SimpleHttp for FallbackSimpleHttp {
	async fn make_request(
		&self,
		method: &'static str,
		url: String,
	) -> Result<SimpleResponse, AnyError> {
		let r1 = self.native.make_request(method, url.clone()).await;
		if let Ok(res) = r1 {
			if !res.status_code.is_server_error() {
				return Ok(res);
			}
		}

		self.delegated.make_request(method, url).await
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/util/input.rs]---
Location: vscode-main/cli/src/util/input.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
use crate::util::errors::wrap;
use dialoguer::{theme::ColorfulTheme, Confirm, Input, Select};
use indicatif::ProgressBar;
use std::fmt::Display;

use super::{errors::WrappedError, io::ReportCopyProgress};

/// Wrapper around indicatif::ProgressBar that implements ReportCopyProgress.
pub struct ProgressBarReporter {
	bar: ProgressBar,
	has_set_total: bool,
}

impl From<ProgressBar> for ProgressBarReporter {
	fn from(bar: ProgressBar) -> Self {
		ProgressBarReporter {
			bar,
			has_set_total: false,
		}
	}
}

impl ReportCopyProgress for ProgressBarReporter {
	fn report_progress(&mut self, bytes_so_far: u64, total_bytes: u64) {
		if !self.has_set_total {
			self.bar.set_length(total_bytes);
		}

		if bytes_so_far == total_bytes {
			self.bar.finish_and_clear();
		} else {
			self.bar.set_position(bytes_so_far);
		}
	}
}

pub fn prompt_yn(text: &str) -> Result<bool, WrappedError> {
	Confirm::with_theme(&ColorfulTheme::default())
		.with_prompt(text)
		.default(true)
		.interact()
		.map_err(|e| wrap(e, "Failed to read confirm input"))
}

pub fn prompt_options<T>(text: impl Into<String>, options: &[T]) -> Result<T, WrappedError>
where
	T: Display + Copy,
{
	let chosen = Select::with_theme(&ColorfulTheme::default())
		.with_prompt(text)
		.items(options)
		.default(0)
		.interact()
		.map_err(|e| wrap(e, "Failed to read select input"))?;

	Ok(options[chosen])
}

pub fn prompt_placeholder(question: &str, placeholder: &str) -> Result<String, WrappedError> {
	Input::with_theme(&ColorfulTheme::default())
		.with_prompt(question)
		.default(placeholder.to_string())
		.interact_text()
		.map_err(|e| wrap(e, "Failed to read confirm input"))
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/util/io.rs]---
Location: vscode-main/cli/src/util/io.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
use std::{
	fs::File,
	io::{self, BufRead, Seek},
	task::Poll,
	time::Duration,
};

use tokio::{
	io::{AsyncRead, AsyncReadExt, AsyncWrite, AsyncWriteExt},
	sync::mpsc,
	time::sleep,
};

use super::ring_buffer::RingBuffer;

pub trait ReportCopyProgress {
	fn report_progress(&mut self, bytes_so_far: u64, total_bytes: u64);
}

/// Type that doesn't emit anything for download progress.
pub struct SilentCopyProgress();

impl ReportCopyProgress for SilentCopyProgress {
	fn report_progress(&mut self, _bytes_so_far: u64, _total_bytes: u64) {}
}

/// Copies from the reader to the writer, reporting progress to the provided
/// reporter every so often.
pub async fn copy_async_progress<T, R, W>(
	mut reporter: T,
	reader: &mut R,
	writer: &mut W,
	total_bytes: u64,
) -> io::Result<u64>
where
	R: AsyncRead + Unpin,
	W: AsyncWrite + Unpin,
	T: ReportCopyProgress,
{
	let mut buf = vec![0; 8 * 1024];
	let mut bytes_so_far = 0;
	let mut bytes_last_reported = 0;
	let report_granularity = std::cmp::min(total_bytes / 10, 2 * 1024 * 1024);

	reporter.report_progress(0, total_bytes);

	loop {
		let read_buf = match reader.read(&mut buf).await {
			Ok(0) => break,
			Ok(n) => &buf[..n],
			Err(e) => return Err(e),
		};

		writer.write_all(read_buf).await?;

		bytes_so_far += read_buf.len() as u64;
		if bytes_so_far - bytes_last_reported > report_granularity {
			bytes_last_reported = bytes_so_far;
			reporter.report_progress(bytes_so_far, total_bytes);
		}
	}

	reporter.report_progress(bytes_so_far, total_bytes);

	Ok(bytes_so_far)
}

/// Helper used when converting Future interfaces to poll-based interfaces.
/// Stores excess data that can be reused on future polls.
#[derive(Default)]
pub(crate) struct ReadBuffer(Option<(Vec<u8>, usize)>);

impl ReadBuffer {
	/// Removes any data stored in the read buffer
	pub fn take_data(&mut self) -> Option<(Vec<u8>, usize)> {
		self.0.take()
	}

	/// Writes as many bytes as possible to the readbuf, stashing any extra.
	pub fn put_data(
		&mut self,
		target: &mut tokio::io::ReadBuf<'_>,
		bytes: Vec<u8>,
		start: usize,
	) -> Poll<std::io::Result<()>> {
		if bytes.is_empty() {
			self.0 = None;
			// should not return Ok(), since if nothing is written to the target
			// it signals EOF. Instead wait for more data from the source.
			return Poll::Pending;
		}

		if target.remaining() >= bytes.len() - start {
			target.put_slice(&bytes[start..]);
			self.0 = None;
		} else {
			let end = start + target.remaining();
			target.put_slice(&bytes[start..end]);
			self.0 = Some((bytes, end));
		}

		Poll::Ready(Ok(()))
	}
}

#[derive(Debug)]
pub enum TailEvent {
	/// A new line was read from the file. The line includes its trailing newline character.
	Line(String),
	/// The file appears to have been rewritten (size shrunk)
	Reset,
	/// An error was encountered with the file.
	Err(io::Error),
}

/// Simple, naive implementation of `tail -f -n <n> <path>`. Uses polling, so
/// it's not the fastest, but simple and working for easy cases.
pub fn tailf(file: File, n: usize) -> mpsc::UnboundedReceiver<TailEvent> {
	let (tx, rx) = mpsc::unbounded_channel();
	let mut last_len = match file.metadata() {
		Ok(m) => m.len(),
		Err(e) => {
			tx.send(TailEvent::Err(e)).ok();
			return rx;
		}
	};

	let mut reader = io::BufReader::new(file);
	let mut pos = 0;

	// Read the initial "n" lines back from the request. initial_lines
	// is a small ring buffer.
	let mut initial_lines = RingBuffer::new(n);
	loop {
		let mut line = String::new();
		let bytes_read = match reader.read_line(&mut line) {
			Ok(0) => break,
			Ok(n) => n,
			Err(e) => {
				tx.send(TailEvent::Err(e)).ok();
				return rx;
			}
		};

		if !line.ends_with('\n') {
			// EOF
			break;
		}

		pos += bytes_read as u64;
		initial_lines.push(line);
	}

	for line in initial_lines.into_iter() {
		tx.send(TailEvent::Line(line)).ok();
	}

	// now spawn the poll process to keep reading new lines
	tokio::spawn(async move {
		let poll_interval = Duration::from_millis(500);

		loop {
			tokio::select! {
				_ = sleep(poll_interval) => {},
				_ = tx.closed() => return
			}

			match reader.get_ref().metadata() {
				Err(e) => {
					tx.send(TailEvent::Err(e)).ok();
					return;
				}
				Ok(m) => {
					if m.len() == last_len {
						continue;
					}

					if m.len() < last_len {
						tx.send(TailEvent::Reset).ok();
						pos = 0;
					}

					last_len = m.len();
				}
			}

			if let Err(e) = reader.seek(io::SeekFrom::Start(pos)) {
				tx.send(TailEvent::Err(e)).ok();
				return;
			}

			loop {
				let mut line = String::new();
				let n = match reader.read_line(&mut line) {
					Ok(0) => break,
					Ok(n) => n,
					Err(e) => {
						tx.send(TailEvent::Err(e)).ok();
						return;
					}
				};

				if n == 0 || !line.ends_with('\n') {
					break;
				}

				pos += n as u64;
				if tx.send(TailEvent::Line(line)).is_err() {
					return;
				}
			}
		}
	});

	rx
}

#[cfg(test)]
mod tests {
	use rand::Rng;
	use std::{fs::OpenOptions, io::Write};

	use super::*;

	#[tokio::test]
	async fn test_tailf_empty() {
		let dir = tempfile::tempdir().unwrap();
		let file_path = dir.path().join("tmp");

		let read_file = OpenOptions::new()
			.write(true)
			.read(true)
			.create(true)
			.truncate(true)
			.open(&file_path)
			.unwrap();

		let mut rx = tailf(read_file, 32);
		assert!(rx.try_recv().is_err());

		let mut append_file = OpenOptions::new().append(true).open(&file_path).unwrap();
		writeln!(&mut append_file, "some line").unwrap();

		let recv = rx.recv().await;
		if let Some(TailEvent::Line(l)) = recv {
			assert_eq!("some line\n".to_string(), l);
		} else {
			unreachable!("expect a line event, got {:?}", recv)
		}

		write!(&mut append_file, "partial ").unwrap();
		writeln!(&mut append_file, "line").unwrap();

		let recv = rx.recv().await;
		if let Some(TailEvent::Line(l)) = recv {
			assert_eq!("partial line\n".to_string(), l);
		} else {
			unreachable!("expect a line event, got {:?}", recv)
		}
	}

	#[tokio::test]
	async fn test_tailf_resets() {
		let dir = tempfile::tempdir().unwrap();
		let file_path = dir.path().join("tmp");

		let mut read_file = OpenOptions::new()
			.write(true)
			.read(true)
			.create(true)
			.truncate(true)
			.open(&file_path)
			.unwrap();

		writeln!(&mut read_file, "some existing content").unwrap();
		let mut rx = tailf(read_file, 0);
		assert!(rx.try_recv().is_err());

		let mut append_file = File::create(&file_path).unwrap(); // truncates
		writeln!(&mut append_file, "some line").unwrap();

		let recv = rx.recv().await;
		if let Some(TailEvent::Reset) = recv {
			// ok
		} else {
			unreachable!("expect a reset event, got {:?}", recv)
		}

		let recv = rx.recv().await;
		if let Some(TailEvent::Line(l)) = recv {
			assert_eq!("some line\n".to_string(), l);
		} else {
			unreachable!("expect a line event, got {:?}", recv)
		}
	}

	#[tokio::test]
	async fn test_tailf_with_data() {
		let dir = tempfile::tempdir().unwrap();
		let file_path = dir.path().join("tmp");

		let mut read_file = OpenOptions::new()
			.write(true)
			.read(true)
			.create(true)
			.truncate(true)
			.open(&file_path)
			.unwrap();
		let mut rng = rand::thread_rng();

		let mut written = vec![];
		let base_line = "Elit ipsum cillum ex cillum. Adipisicing consequat cupidatat do proident ut in sunt Lorem ipsum tempor. Eiusmod ipsum Lorem labore exercitation sunt pariatur excepteur fugiat cillum velit cillum enim. Nisi Lorem cupidatat ad enim velit officia eiusmod esse tempor aliquip. Deserunt pariatur tempor in duis culpa esse sit nulla irure ullamco ipsum voluptate non laboris. Occaecat officia nulla officia mollit do aliquip reprehenderit ad incididunt.";
		for i in 0..100 {
			let line = format!("{}: {}", i, &base_line[..rng.gen_range(0..base_line.len())]);
			writeln!(&mut read_file, "{line}").unwrap();
			written.push(line);
		}
		write!(&mut read_file, "partial line").unwrap();
		read_file.seek(io::SeekFrom::Start(0)).unwrap();

		let last_n = 32;
		let mut rx = tailf(read_file, last_n);
		for i in 0..last_n {
			let recv = rx.try_recv().unwrap();
			if let TailEvent::Line(l) = recv {
				let mut expected = written[written.len() - last_n + i].to_string();
				expected.push('\n');
				assert_eq!(expected, l);
			} else {
				unreachable!("expect a line event, got {:?}", recv)
			}
		}

		assert!(rx.try_recv().is_err());

		let mut append_file = OpenOptions::new().append(true).open(&file_path).unwrap();
		writeln!(append_file, " is now complete").unwrap();

		let recv = rx.recv().await;
		if let Some(TailEvent::Line(l)) = recv {
			assert_eq!("partial line is now complete\n".to_string(), l);
		} else {
			unreachable!("expect a line event, got {:?}", recv)
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/util/is_integrated.rs]---
Location: vscode-main/cli/src/util/is_integrated.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use std::{env, io};

/// Gets whether the current CLI seems like it's running in integrated mode,
/// by looking at the location of the exe and known VS Code files.
pub fn is_integrated_cli() -> io::Result<bool> {
	let exe = env::current_exe()?;

	let parent = match exe.parent() {
		Some(parent) if parent.file_name().and_then(|n| n.to_str()) == Some("bin") => parent,
		_ => return Ok(false),
	};

	let parent = match parent.parent() {
		Some(p) => p,
		None => return Ok(false),
	};

	let expected_file = if cfg!(target_os = "macos") {
		"node_modules.asar"
	} else {
		"resources.pak"
	};

	Ok(parent.join(expected_file).exists())
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/util/machine.rs]---
Location: vscode-main/cli/src/util/machine.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use std::{
	ffi::OsString,
	path::{Path, PathBuf},
	time::Duration,
};
use sysinfo::{Pid, PidExt, ProcessExt, System, SystemExt};

pub fn process_at_path_exists(pid: u32, name: &Path) -> bool {
	let mut sys = System::new();
	let pid = Pid::from_u32(pid);
	if !sys.refresh_process(pid) {
		return false;
	}

	let name_str = format!("{}", name.display());
	if let Some(process) = sys.process(pid) {
		for cmd in process.cmd() {
			if cmd.contains(&name_str) {
				return true;
			}
		}
	}

	false
}
pub fn process_exists(pid: u32) -> bool {
	let mut sys = System::new();
	sys.refresh_process(Pid::from_u32(pid))
}

pub fn kill_pid(pid: u32) -> bool {
	let mut sys = System::new();
	let pid = Pid::from_u32(pid);
	sys.refresh_process(pid);

	if let Some(p) = sys.process(pid) {
		p.kill()
	} else {
		false
	}
}

pub async fn wait_until_process_exits(pid: Pid, poll_ms: u64) {
	let mut s = System::new();
	let duration = Duration::from_millis(poll_ms);
	while s.refresh_process(pid) {
		tokio::time::sleep(duration).await;
	}
}

pub fn find_running_process(name: &Path) -> Option<u32> {
	let mut sys = System::new();
	sys.refresh_processes();

	let name_str = format!("{}", name.display());

	for (pid, process) in sys.processes() {
		for cmd in process.cmd() {
			if cmd.contains(&name_str) {
				return Some(pid.as_u32());
			}
		}
	}
	None
}

pub async fn wait_until_exe_deleted(current_exe: &Path, poll_ms: u64) {
	let duration = Duration::from_millis(poll_ms);
	while current_exe.exists() {
		tokio::time::sleep(duration).await;
	}
}

/// Gets the canonical current exe location, referring to the "current" symlink
/// if running inside snap.
pub fn canonical_exe() -> std::io::Result<PathBuf> {
	canonical_exe_inner(
		std::env::current_exe(),
		std::env::var_os("SNAP"),
		std::env::var_os("SNAP_REVISION"),
	)
}

#[inline(always)]
#[allow(unused_variables)]
fn canonical_exe_inner(
	exe: std::io::Result<PathBuf>,
	snap: Option<OsString>,
	rev: Option<OsString>,
) -> std::io::Result<PathBuf> {
	let exe = exe?;

	#[cfg(target_os = "linux")]
	if let (Some(snap), Some(rev)) = (snap, rev) {
		if !exe.starts_with(snap) {
			return Ok(exe);
		}

		let mut out = PathBuf::new();
		for part in exe.iter() {
			if part == rev {
				out.push("current")
			} else {
				out.push(part)
			}
		}

		return Ok(out);
	}

	Ok(exe)
}

#[cfg(test)]
mod tests {
	use super::*;
	use std::path::PathBuf;

	#[test]
	#[cfg(target_os = "linux")]
	fn test_canonical_exe_in_snap() {
		let exe = canonical_exe_inner(
			Ok(PathBuf::from("/snap/my-snap/1234/some/exe")),
			Some("/snap/my-snap/1234".into()),
			Some("1234".into()),
		)
		.unwrap();
		assert_eq!(exe, PathBuf::from("/snap/my-snap/current/some/exe"));
	}

	#[test]
	fn test_canonical_exe_not_in_snap() {
		let exe = canonical_exe_inner(
			Ok(PathBuf::from("/not-in-snap")),
			Some("/snap/my-snap/1234".into()),
			Some("1234".into()),
		)
		.unwrap();
		assert_eq!(exe, PathBuf::from("/not-in-snap"));
	}

	#[test]
	fn test_canonical_exe_not_in_snap2() {
		let exe = canonical_exe_inner(Ok(PathBuf::from("/not-in-snap")), None, None).unwrap();
		assert_eq!(exe, PathBuf::from("/not-in-snap"));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/util/os.rs]---
Location: vscode-main/cli/src/util/os.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

#[cfg(windows)]
pub fn os_release() -> Result<String, std::io::Error> {
	// The windows API *had* nice GetVersionEx/A APIs, but these were deprecated
	// in Winodws 8 and there's no newer win API to get version numbers. So
	// instead read the registry.

	use winreg::{enums::HKEY_LOCAL_MACHINE, RegKey};

	let key = RegKey::predef(HKEY_LOCAL_MACHINE)
		.open_subkey(r"SOFTWARE\Microsoft\Windows NT\CurrentVersion")?;

	let major: u32 = key.get_value("CurrentMajorVersionNumber")?;
	let minor: u32 = key.get_value("CurrentMinorVersionNumber")?;
	let build: String = key.get_value("CurrentBuild")?;

	Ok(format!("{}.{}.{}", major, minor, build))
}

#[cfg(unix)]
pub fn os_release() -> Result<String, std::io::Error> {
	use std::{ffi::CStr, mem};

	unsafe {
		let mut ret = mem::MaybeUninit::zeroed();

		if libc::uname(ret.as_mut_ptr()) != 0 {
			return Err(std::io::Error::last_os_error());
		}

		let ret = ret.assume_init();
		let c_str: &CStr = CStr::from_ptr(ret.release.as_ptr());
		Ok(c_str.to_string_lossy().into_owned())
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/util/prereqs.rs]---
Location: vscode-main/cli/src/util/prereqs.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
use std::cmp::Ordering;

use crate::constants::QUALITYLESS_SERVER_NAME;
use crate::update_service::Platform;
use lazy_static::lazy_static;
use regex::bytes::Regex as BinRegex;
use regex::Regex;
use tokio::fs;

use super::errors::CodeError;

lazy_static! {
	static ref LDCONFIG_STDC_RE: Regex = Regex::new(r"libstdc\+\+.* => (.+)").unwrap();
	static ref LDD_VERSION_RE: BinRegex = BinRegex::new(r"^ldd.*\s(\d+)\.(\d+)(?:\.(\d+))?\s").unwrap();
	static ref GENERIC_VERSION_RE: Regex = Regex::new(r"^([0-9]+)\.([0-9]+)$").unwrap();
	static ref LIBSTD_CXX_VERSION_RE: BinRegex =
		BinRegex::new(r"GLIBCXX_([0-9]+)\.([0-9]+)(?:\.([0-9]+))?").unwrap();
	static ref MIN_LDD_VERSION: SimpleSemver = SimpleSemver::new(2, 28, 0);
}

#[cfg(target_arch = "arm")]
lazy_static! {
	static ref MIN_CXX_VERSION: SimpleSemver = SimpleSemver::new(3, 4, 26);
}

#[cfg(not(target_arch = "arm"))]
lazy_static! {
	static ref MIN_CXX_VERSION: SimpleSemver = SimpleSemver::new(3, 4, 25);
}

const NIXOS_TEST_PATH: &str = "/etc/NIXOS";

pub struct PreReqChecker {}

impl Default for PreReqChecker {
	fn default() -> Self {
		Self::new()
	}
}

impl PreReqChecker {
	pub fn new() -> PreReqChecker {
		PreReqChecker {}
	}

	#[cfg(not(target_os = "linux"))]
	pub async fn verify(&self) -> Result<Platform, CodeError> {
		Platform::env_default().ok_or_else(|| {
			CodeError::UnsupportedPlatform(format!(
				"{} {}",
				std::env::consts::OS,
				std::env::consts::ARCH
			))
		})
	}

	#[cfg(target_os = "linux")]
	pub async fn verify(&self) -> Result<Platform, CodeError> {
		let (is_nixos, skip_glibc_checks, or_musl) = tokio::join!(
			check_is_nixos(),
			skip_requirements_check(),
			check_musl_interpreter()
		);

		let (gnu_a, gnu_b) = if !skip_glibc_checks {
			tokio::join!(check_glibc_version(), check_glibcxx_version())
		} else {
			println!("!!! WARNING: Skipping server pre-requisite check !!!");
			println!("!!! Server stability is not guaranteed. Proceed at your own risk. !!!");
			(Ok(true), Ok(true))
		};

		match (&gnu_a, &gnu_b, is_nixos) {
			(Ok(true), Ok(true), _) | (_, _, true) => {
				return Ok(if cfg!(target_arch = "x86_64") {
					Platform::LinuxX64
				} else if cfg!(target_arch = "arm") {
					Platform::LinuxARM32
				} else {
					Platform::LinuxARM64
				});
			}
			_ => {}
		};

		if or_musl.is_ok() {
			return Ok(if cfg!(target_arch = "x86_64") {
				Platform::LinuxAlpineX64
			} else {
				Platform::LinuxAlpineARM64
			});
		}

		let mut errors: Vec<String> = vec![];
		if let Err(e) = gnu_a {
			errors.push(e);
		} else if let Err(e) = gnu_b {
			errors.push(e);
		}

		if let Err(e) = or_musl {
			errors.push(e);
		}

		let bullets = errors
			.iter()
			.map(|e| format!("  - {e}"))
			.collect::<Vec<String>>()
			.join("\n");

		Err(CodeError::PrerequisitesFailed {
			bullets,
			name: QUALITYLESS_SERVER_NAME,
		})
	}
}

#[allow(dead_code)]
async fn check_musl_interpreter() -> Result<(), String> {
	const MUSL_PATH: &str = if cfg!(target_arch = "aarch64") {
		"/lib/ld-musl-aarch64.so.1"
	} else {
		"/lib/ld-musl-x86_64.so.1"
	};

	if fs::metadata(MUSL_PATH).await.is_err() {
		return Err(format!(
			"find {MUSL_PATH}, which is required to run the {QUALITYLESS_SERVER_NAME} in musl environments"
		));
	}

	Ok(())
}

/// Checks the glibc version, returns "true" if the default server is required.
#[cfg(target_os = "linux")]
async fn check_glibc_version() -> Result<bool, String> {
	#[cfg(target_env = "gnu")]
	let version = {
		let v = unsafe { libc::gnu_get_libc_version() };
		let v = unsafe { std::ffi::CStr::from_ptr(v) };
		let v = v.to_str().unwrap();
		extract_generic_version(v)
	};
	#[cfg(not(target_env = "gnu"))]
	let version = {
		super::command::capture_command("ldd", ["--version"])
			.await
			.ok()
			.and_then(|o| extract_ldd_version(&o.stdout))
	};

	if let Some(v) = version {
		return if v >= *MIN_LDD_VERSION {
			Ok(true)
		} else {
			Err(format!(
				"find GLIBC >= {} (but found {} instead) for GNU environments",
				*MIN_LDD_VERSION, v
			))
		};
	}

	Ok(false)
}

/// Check for nixos to avoid mandating glibc versions. See:
/// https://github.com/microsoft/vscode-remote-release/issues/7129
#[allow(dead_code)]
async fn check_is_nixos() -> bool {
	fs::metadata(NIXOS_TEST_PATH).await.is_ok()
}

/// Do not remove this check.
/// Provides a way to skip the server glibc requirements check from
/// outside the install flow.
///
/// 1) A system process can create this
///    file before the server is downloaded and installed.
///
/// 2) An environment variable declared in host
///    that contains path to a glibc sysroot satisfying the
///    minimum requirements.
#[cfg(not(windows))]
pub async fn skip_requirements_check() -> bool {
	std::env::var("VSCODE_SERVER_CUSTOM_GLIBC_LINKER").is_ok() ||
	fs::metadata("/tmp/vscode-skip-server-requirements-check")
		.await
		.is_ok()
}

#[cfg(windows)]
pub async fn skip_requirements_check() -> bool {
	false
}

/// Checks the glibc++ version, returns "true" if the default server is required.
#[cfg(target_os = "linux")]
async fn check_glibcxx_version() -> Result<bool, String> {
	let mut libstdc_path: Option<String> = None;

	#[cfg(any(target_arch = "x86_64", target_arch = "aarch64"))]
	const DEFAULT_LIB_PATH: &str = "/usr/lib64/libstdc++.so.6";
	#[cfg(any(target_arch = "x86", target_arch = "arm"))]
	const DEFAULT_LIB_PATH: &str = "/usr/lib/libstdc++.so.6";
	const LDCONFIG_PATH: &str = "/sbin/ldconfig";

	if fs::metadata(DEFAULT_LIB_PATH).await.is_ok() {
		libstdc_path = Some(DEFAULT_LIB_PATH.to_owned());
	} else if fs::metadata(LDCONFIG_PATH).await.is_ok() {
		libstdc_path = super::command::capture_command(LDCONFIG_PATH, ["-p"])
			.await
			.ok()
			.and_then(|o| extract_libstd_from_ldconfig(&o.stdout));
	}

	match libstdc_path {
		Some(path) => match fs::read(&path).await {
			Ok(contents) => check_for_sufficient_glibcxx_versions(contents),
			Err(e) => Err(format!(
				"validate GLIBCXX version for GNU environments, but could not: {e}"
			)),
		},
		None => Err("find libstdc++.so or ldconfig for GNU environments".to_owned()),
	}
}

#[cfg(target_os = "linux")]
fn check_for_sufficient_glibcxx_versions(contents: Vec<u8>) -> Result<bool, String> {
	let max_version = LIBSTD_CXX_VERSION_RE
		.captures_iter(&contents)
		.map(|m| SimpleSemver {
			major: m.get(1).map_or(0, |s| u32_from_bytes(s.as_bytes())),
			minor: m.get(2).map_or(0, |s| u32_from_bytes(s.as_bytes())),
			patch: m.get(3).map_or(0, |s| u32_from_bytes(s.as_bytes())),
		})
		.max();

	if let Some(max_version) = &max_version {
		if max_version >= &*MIN_CXX_VERSION {
			return Ok(true);
		}
	}

	Err(format!(
		"find GLIBCXX >= {} (but found {} instead) for GNU environments",
		*MIN_CXX_VERSION,
		max_version
			.as_ref()
			.map(String::from)
			.unwrap_or("none".to_string())
	))
}

#[allow(dead_code)]
fn extract_ldd_version(output: &[u8]) -> Option<SimpleSemver> {
	LDD_VERSION_RE.captures(output).map(|m| SimpleSemver {
		major: m.get(1).map_or(0, |s| u32_from_bytes(s.as_bytes())),
		minor: m.get(2).map_or(0, |s| u32_from_bytes(s.as_bytes())),
		patch: 0,
	})
}

#[allow(dead_code)]
fn extract_generic_version(output: &str) -> Option<SimpleSemver> {
	GENERIC_VERSION_RE.captures(output).map(|m| SimpleSemver {
		major: m.get(1).map_or(0, |s| s.as_str().parse().unwrap()),
		minor: m.get(2).map_or(0, |s| s.as_str().parse().unwrap()),
		patch: 0,
	})
}

#[allow(dead_code)]
fn extract_libstd_from_ldconfig(output: &[u8]) -> Option<String> {
	String::from_utf8_lossy(output)
		.lines()
		.find_map(|l| LDCONFIG_STDC_RE.captures(l))
		.and_then(|cap| cap.get(1))
		.map(|cap| cap.as_str().to_owned())
}

fn u32_from_bytes(b: &[u8]) -> u32 {
	String::from_utf8_lossy(b).parse::<u32>().unwrap_or(0)
}

#[derive(Debug, Default, PartialEq, Eq)]
struct SimpleSemver {
	major: u32,
	minor: u32,
	patch: u32,
}

impl PartialOrd for SimpleSemver {
	fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
		Some(self.cmp(other))
	}
}

impl Ord for SimpleSemver {
	fn cmp(&self, other: &Self) -> Ordering {
		let major = self.major.cmp(&other.major);
		if major != Ordering::Equal {
			return major;
		}

		let minor = self.minor.cmp(&other.minor);
		if minor != Ordering::Equal {
			return minor;
		}

		self.patch.cmp(&other.patch)
	}
}

impl From<&SimpleSemver> for String {
	fn from(s: &SimpleSemver) -> Self {
		format!("v{}.{}.{}", s.major, s.minor, s.patch)
	}
}

impl std::fmt::Display for SimpleSemver {
	fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
		write!(f, "{}", String::from(self))
	}
}

#[allow(dead_code)]
impl SimpleSemver {
	fn new(major: u32, minor: u32, patch: u32) -> SimpleSemver {
		SimpleSemver {
			major,
			minor,
			patch,
		}
	}
}

#[cfg(test)]
mod tests {
	use super::*;

	#[test]
	fn test_extract_libstd_from_ldconfig() {
		let actual = "
							libstoken.so.1 (libc6,x86-64) => /lib/x86_64-linux-gnu/libstoken.so.1
							libstemmer.so.0d (libc6,x86-64) => /lib/x86_64-linux-gnu/libstemmer.so.0d
							libstdc++.so.6 (libc6,x86-64) => /lib/x86_64-linux-gnu/libstdc++.so.6
							libstartup-notification-1.so.0 (libc6,x86-64) => /lib/x86_64-linux-gnu/libstartup-notification-1.so.0
							libssl3.so (libc6,x86-64) => /lib/x86_64-linux-gnu/libssl3.so
					".to_owned().into_bytes();

		assert_eq!(
			extract_libstd_from_ldconfig(&actual),
			Some("/lib/x86_64-linux-gnu/libstdc++.so.6".to_owned()),
		);

		assert_eq!(
			extract_libstd_from_ldconfig(&"nothing here!".to_owned().into_bytes()),
			None,
		);
	}

	#[test]
	fn test_gte() {
		assert!(SimpleSemver::new(1, 2, 3) >= SimpleSemver::new(1, 2, 3));
		assert!(SimpleSemver::new(1, 2, 3) >= SimpleSemver::new(0, 10, 10));
		assert!(SimpleSemver::new(1, 2, 3) >= SimpleSemver::new(1, 1, 10));

		assert!(SimpleSemver::new(1, 2, 3) < SimpleSemver::new(1, 2, 10));
		assert!(SimpleSemver::new(1, 2, 3) < SimpleSemver::new(1, 3, 1));
		assert!(SimpleSemver::new(1, 2, 3) < SimpleSemver::new(2, 2, 1));
	}

	#[test]
	fn check_for_sufficient_glibcxx_versions() {
		let actual = "ldd (Ubuntu GLIBC 2.31-0ubuntu9.7) 2.31
					Copyright (C) 2020 Free Software Foundation, Inc.
					This is free software; see the source for copying conditions.  There is NO
					warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
					Written by Roland McGrath and Ulrich Drepper."
			.to_owned()
			.into_bytes();

		assert_eq!(
			extract_ldd_version(&actual),
			Some(SimpleSemver::new(2, 31, 0)),
		);

		let actual2 = "ldd (GNU libc) 2.40.9000
					Copyright (C) 2024 Free Software Foundation, Inc.
					This is free software; see the source for copying conditions.  There is NO
					warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
					Written by Roland McGrath and Ulrich Drepper."
			.to_owned()
			.into_bytes();
		assert_eq!(
			extract_ldd_version(&actual2),
			Some(SimpleSemver::new(2, 40, 0)),
		);
	}

}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/util/ring_buffer.rs]---
Location: vscode-main/cli/src/util/ring_buffer.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

pub struct RingBuffer<T> {
	data: Vec<T>,
	i: usize,
}

impl<T> RingBuffer<T> {
	pub fn new(capacity: usize) -> Self {
		Self {
			data: Vec::with_capacity(capacity),
			i: 0,
		}
	}

	pub fn capacity(&self) -> usize {
		self.data.capacity()
	}

	pub fn len(&self) -> usize {
		self.data.len()
	}

	pub fn is_full(&self) -> bool {
		self.data.len() == self.data.capacity()
	}

	pub fn is_empty(&self) -> bool {
		self.data.len() == 0
	}

	pub fn push(&mut self, value: T) {
		if self.data.len() == self.data.capacity() {
			self.data[self.i] = value;
		} else {
			self.data.push(value);
		}

		self.i = (self.i + 1) % self.data.capacity();
	}

	pub fn iter(&self) -> RingBufferIter<'_, T> {
		RingBufferIter {
			index: 0,
			buffer: self,
		}
	}
}

impl<T: Default> IntoIterator for RingBuffer<T> {
	type Item = T;
	type IntoIter = OwnedRingBufferIter<T>;

	fn into_iter(self) -> OwnedRingBufferIter<T>
	where
		T: Default,
	{
		OwnedRingBufferIter {
			index: 0,
			buffer: self,
		}
	}
}

pub struct OwnedRingBufferIter<T: Default> {
	buffer: RingBuffer<T>,
	index: usize,
}

impl<T: Default> Iterator for OwnedRingBufferIter<T> {
	type Item = T;

	fn next(&mut self) -> Option<Self::Item> {
		if self.index == self.buffer.len() {
			return None;
		}

		let ii = (self.index + self.buffer.i) % self.buffer.len();
		let item = std::mem::take(&mut self.buffer.data[ii]);
		self.index += 1;
		Some(item)
	}
}

pub struct RingBufferIter<'a, T> {
	buffer: &'a RingBuffer<T>,
	index: usize,
}

impl<'a, T> Iterator for RingBufferIter<'a, T> {
	type Item = &'a T;

	fn next(&mut self) -> Option<Self::Item> {
		if self.index == self.buffer.len() {
			return None;
		}

		let ii = (self.index + self.buffer.i) % self.buffer.len();
		let item = &self.buffer.data[ii];
		self.index += 1;
		Some(item)
	}
}

#[cfg(test)]
mod tests {
	use super::*;

	#[test]
	fn test_inserts() {
		let mut rb = RingBuffer::new(3);
		assert_eq!(rb.capacity(), 3);
		assert!(!rb.is_full());
		assert_eq!(rb.len(), 0);
		assert_eq!(rb.iter().copied().count(), 0);

		rb.push(1);
		assert!(!rb.is_full());
		assert_eq!(rb.len(), 1);
		assert_eq!(rb.iter().copied().collect::<Vec<i32>>(), vec![1]);

		rb.push(2);
		assert!(!rb.is_full());
		assert_eq!(rb.len(), 2);
		assert_eq!(rb.iter().copied().collect::<Vec<i32>>(), vec![1, 2]);

		rb.push(3);
		assert!(rb.is_full());
		assert_eq!(rb.len(), 3);
		assert_eq!(rb.iter().copied().collect::<Vec<i32>>(), vec![1, 2, 3]);

		rb.push(4);
		assert!(rb.is_full());
		assert_eq!(rb.len(), 3);
		assert_eq!(rb.iter().copied().collect::<Vec<i32>>(), vec![2, 3, 4]);

		assert_eq!(rb.into_iter().collect::<Vec<i32>>(), vec![2, 3, 4]);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/util/sync.rs]---
Location: vscode-main/cli/src/util/sync.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
use async_trait::async_trait;
use std::{marker::PhantomData, sync::Arc};
use tokio::sync::{
	broadcast, mpsc,
	watch::{self, error::RecvError},
};

#[derive(Clone)]
pub struct Barrier<T>(watch::Receiver<Option<T>>)
where
	T: Clone;

impl<T> Barrier<T>
where
	T: Clone,
{
	/// Waits for the barrier to be closed, returning a value if one was sent.
	pub async fn wait(&mut self) -> Result<T, RecvError> {
		loop {
			self.0.changed().await?;

			if let Some(v) = self.0.borrow().clone() {
				return Ok(v);
			}
		}
	}

	/// Gets whether the barrier is currently open
	pub fn is_open(&self) -> bool {
		self.0.borrow().is_some()
	}
}

#[async_trait]
impl<T: Clone + Send + Sync> Receivable<T> for Barrier<T> {
	async fn recv_msg(&mut self) -> Option<T> {
		self.wait().await.ok()
	}
}

#[derive(Clone)]
pub struct BarrierOpener<T: Clone>(Arc<watch::Sender<Option<T>>>);

impl<T: Clone> BarrierOpener<T> {
	/// Opens the barrier.
	pub fn open(&self, value: T) {
		self.0.send_if_modified(|v| {
			if v.is_none() {
				*v = Some(value);
				true
			} else {
				false
			}
		});
	}
}

/// The Barrier is something that can be opened once from one side,
/// and is thereafter permanently closed. It can contain a value.
pub fn new_barrier<T>() -> (Barrier<T>, BarrierOpener<T>)
where
	T: Clone,
{
	let (closed_tx, closed_rx) = watch::channel(None);
	(Barrier(closed_rx), BarrierOpener(Arc::new(closed_tx)))
}

/// Type that can receive messages in an async way.
#[async_trait]
pub trait Receivable<T> {
	async fn recv_msg(&mut self) -> Option<T>;
}

// todo: ideally we would use an Arc in the broadcast::Receiver to avoid having
// to clone bytes everywhere, requires updating rpc consumers as well.
#[async_trait]
impl<T: Clone + Send> Receivable<T> for broadcast::Receiver<T> {
	async fn recv_msg(&mut self) -> Option<T> {
		loop {
			match self.recv().await {
				Ok(v) => return Some(v),
				Err(broadcast::error::RecvError::Lagged(_)) => continue,
				Err(broadcast::error::RecvError::Closed) => return None,
			}
		}
	}
}

#[async_trait]
impl<T: Send> Receivable<T> for mpsc::UnboundedReceiver<T> {
	async fn recv_msg(&mut self) -> Option<T> {
		self.recv().await
	}
}

#[async_trait]
impl<T: Send> Receivable<T> for () {
	async fn recv_msg(&mut self) -> Option<T> {
		futures::future::pending().await
	}
}

pub struct ConcatReceivable<T: Send, A: Receivable<T>, B: Receivable<T>> {
	left: Option<A>,
	right: B,
	_marker: PhantomData<T>,
}

impl<T: Send, A: Receivable<T>, B: Receivable<T>> ConcatReceivable<T, A, B> {
	pub fn new(left: A, right: B) -> Self {
		Self {
			left: Some(left),
			right,
			_marker: PhantomData,
		}
	}
}

#[async_trait]
impl<T: Send, A: Send + Receivable<T>, B: Send + Receivable<T>> Receivable<T>
	for ConcatReceivable<T, A, B>
{
	async fn recv_msg(&mut self) -> Option<T> {
		if let Some(left) = &mut self.left {
			match left.recv_msg().await {
				Some(v) => return Some(v),
				None => {
					self.left = None;
				}
			}
		}

		return self.right.recv_msg().await;
	}
}

pub struct MergedReceivable<T: Send, A: Receivable<T>, B: Receivable<T>> {
	left: Option<A>,
	right: Option<B>,
	_marker: PhantomData<T>,
}

impl<T: Send, A: Receivable<T>, B: Receivable<T>> MergedReceivable<T, A, B> {
	pub fn new(left: A, right: B) -> Self {
		Self {
			left: Some(left),
			right: Some(right),
			_marker: PhantomData,
		}
	}
}

#[async_trait]
impl<T: Send, A: Send + Receivable<T>, B: Send + Receivable<T>> Receivable<T>
	for MergedReceivable<T, A, B>
{
	async fn recv_msg(&mut self) -> Option<T> {
		loop {
			match (&mut self.left, &mut self.right) {
				(Some(left), Some(right)) => {
					tokio::select! {
						left = left.recv_msg() => match left {
							Some(v) => return Some(v),
							None => { self.left = None; continue; },
						},
						right = right.recv_msg() => match right {
							Some(v) => return Some(v),
							None => { self.right = None; continue; },
						},
					}
				}
				(Some(a), None) => break a.recv_msg().await,
				(None, Some(b)) => break b.recv_msg().await,
				(None, None) => break None,
			}
		}
	}
}

#[cfg(test)]
mod tests {
	use super::*;

	#[tokio::test]
	async fn test_barrier_close_after_spawn() {
		let (mut barrier, opener) = new_barrier::<u32>();
		let (tx, rx) = tokio::sync::oneshot::channel::<u32>();

		tokio::spawn(async move {
			tx.send(barrier.wait().await.unwrap()).unwrap();
		});

		opener.open(42);

		assert!(rx.await.unwrap() == 42);
	}

	#[tokio::test]
	async fn test_barrier_close_before_spawn() {
		let (barrier, opener) = new_barrier::<u32>();
		let (tx1, rx1) = tokio::sync::oneshot::channel::<u32>();
		let (tx2, rx2) = tokio::sync::oneshot::channel::<u32>();

		opener.open(42);
		let mut b1 = barrier.clone();
		tokio::spawn(async move {
			tx1.send(b1.wait().await.unwrap()).unwrap();
		});
		let mut b2 = barrier.clone();
		tokio::spawn(async move {
			tx2.send(b2.wait().await.unwrap()).unwrap();
		});

		assert!(rx1.await.unwrap() == 42);
		assert!(rx2.await.unwrap() == 42);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/util/tar.rs]---
Location: vscode-main/cli/src/util/tar.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
use crate::util::errors::{wrap, WrappedError};

use flate2::read::GzDecoder;
use std::fs::{self, File};
use std::io::{Read, Seek};
use std::path::{Path, PathBuf};
use tar::Archive;

use super::errors::wrapdbg;
use super::io::ReportCopyProgress;

fn should_skip_first_segment(file: &fs::File) -> Result<(bool, u64), WrappedError> {
	// unfortunately, we need to re-read the archive here since you cannot reuse
	// `.entries()`. But this will generally only look at one or two files, so this
	// should be acceptably speedy... If not, we could hardcode behavior for
	// different types of archives.

	let tar = GzDecoder::new(file);
	let mut archive = Archive::new(tar);
	let mut entries = archive
		.entries()
		.map_err(|e| wrap(e, "error opening archive"))?;

	let first_name = {
		let file = entries
			.next()
			.expect("expected not to have an empty archive")
			.map_err(|e| wrap(e, "error reading entry file"))?;

		let path = file.path().expect("expected to have path");

		path.iter()
			.next()
			.expect("expected to have non-empty name")
			.to_owned()
	};

	let mut num_entries = 1;
	let mut had_different_prefixes = false;
	for file in entries.flatten() {
		if !had_different_prefixes {
			if let Ok(name) = file.path() {
				if name.iter().next() != Some(&first_name) {
					had_different_prefixes = true;
				}
			}
		}

		num_entries += 1;
	}

	Ok((!had_different_prefixes && num_entries > 1, num_entries)) // prefix removal is invalid if there's only a single file
}

pub fn decompress_tarball<T>(
	mut tar_gz: File,
	parent_path: &Path,
	mut reporter: T,
) -> Result<(), WrappedError>
where
	T: ReportCopyProgress,
{
	let (skip_first, num_entries) = should_skip_first_segment(&tar_gz)?;
	let report_progress_every = num_entries / 20;
	let mut entries_so_far = 0;
	let mut last_reported_at = 0;

	// reset since skip logic read the tar already:
	tar_gz
		.rewind()
		.map_err(|e| wrap(e, "error resetting seek position"))?;

	let tar = GzDecoder::new(tar_gz);
	let mut archive = Archive::new(tar);
	archive
		.entries()
		.map_err(|e| wrap(e, "error opening archive"))?
		.filter_map(|e| e.ok())
		.try_for_each::<_, Result<_, WrappedError>>(|mut entry| {
			// approximate progress based on where we are in the archive:
			entries_so_far += 1;
			if entries_so_far - last_reported_at > report_progress_every {
				reporter.report_progress(entries_so_far, num_entries);
				entries_so_far += 1;
				last_reported_at = entries_so_far;
			}

			let entry_path = entry
				.path()
				.map_err(|e| wrap(e, "error reading entry path"))?;

			let path = parent_path.join(if skip_first {
				entry_path.iter().skip(1).collect::<PathBuf>()
			} else {
				entry_path.into_owned()
			});

			if let Some(p) = path.parent() {
				fs::create_dir_all(p)
					.map_err(|e| wrap(e, format!("could not create dir for {}", p.display())))?;
			}

			entry
				.unpack(&path)
				.map_err(|e| wrapdbg(e, format!("error unpacking {}", path.display())))?;

			Ok(())
		})?;

	reporter.report_progress(num_entries, num_entries);

	Ok(())
}

pub fn has_gzip_header(path: &Path) -> std::io::Result<(File, bool)> {
	let mut file = fs::File::open(path)?;
	let mut header = [0; 2];
	let _ = file.read_exact(&mut header);

	file.rewind()?;

	Ok((file, header[0] == 0x1f && header[1] == 0x8b))
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/util/zipper.rs]---
Location: vscode-main/cli/src/util/zipper.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
use super::errors::{wrap, WrappedError};
use super::io::ReportCopyProgress;
use std::fs::{self, File};
use std::io;
use std::path::Path;
use std::path::PathBuf;
use zip::read::ZipFile;
use zip::{self, ZipArchive};

// Borrowed and modified from https://github.com/zip-rs/zip/blob/master/examples/extract.rs

/// Returns whether all files in the archive start with the same path segment.
/// If so, it's an indication we should skip that segment when extracting.
fn should_skip_first_segment(archive: &mut ZipArchive<File>) -> bool {
	let first_name = {
		let file = archive
			.by_index_raw(0)
			.expect("expected not to have an empty archive");

		let path = file
			.enclosed_name()
			.expect("expected to have path")
			.iter()
			.next()
			.expect("expected to have non-empty name");

		path.to_owned()
	};

	for i in 1..archive.len() {
		if let Ok(file) = archive.by_index_raw(i) {
			if let Some(name) = file.enclosed_name() {
				if name.iter().next() != Some(&first_name) {
					return false;
				}
			}
		}
	}

	archive.len() > 1 // prefix removal is invalid if there's only a single file
}

pub fn unzip_file<T>(file: File, parent_path: &Path, mut reporter: T) -> Result<(), WrappedError>
where
	T: ReportCopyProgress,
{
	let mut archive =
		zip::ZipArchive::new(file).map_err(|e| wrap(e, "failed to open zip archive"))?;

	let skip_segments_no = usize::from(should_skip_first_segment(&mut archive));
	let report_progress_every = archive.len() / 20;

	for i in 0..archive.len() {
		if i % report_progress_every == 0 {
			reporter.report_progress(i as u64, archive.len() as u64);
		}
		let mut file = archive
			.by_index(i)
			.map_err(|e| wrap(e, format!("could not open zip entry {i}")))?;

		let outpath: PathBuf = match file.enclosed_name() {
			Some(path) => {
				let mut full_path = PathBuf::from(parent_path);
				full_path.push(PathBuf::from_iter(path.iter().skip(skip_segments_no)));
				full_path
			}
			None => continue,
		};

		if file.is_dir() || file.name().ends_with('/') {
			fs::create_dir_all(&outpath)
				.map_err(|e| wrap(e, format!("could not create dir for {}", outpath.display())))?;
			apply_permissions(&file, &outpath)?;
			continue;
		}

		if let Some(p) = outpath.parent() {
			fs::create_dir_all(p)
				.map_err(|e| wrap(e, format!("could not create dir for {}", outpath.display())))?;
		}

		#[cfg(unix)]
		{
			use libc::S_IFLNK;
			use std::io::Read;
			use std::os::unix::ffi::OsStringExt;

			#[cfg(target_os = "macos")]
			const S_IFLINK_32: u32 = S_IFLNK as u32;

			#[cfg(target_os = "linux")]
			const S_IFLINK_32: u32 = S_IFLNK;

			if matches!(file.unix_mode(), Some(mode) if mode & S_IFLINK_32 == S_IFLINK_32) {
				let mut link_to = Vec::new();
				file.read_to_end(&mut link_to).map_err(|e| {
					wrap(
						e,
						format!("could not read symlink linkpath {}", outpath.display()),
					)
				})?;

				let link_path = PathBuf::from(std::ffi::OsString::from_vec(link_to));
				std::os::unix::fs::symlink(link_path, &outpath).map_err(|e| {
					wrap(e, format!("could not create symlink {}", outpath.display()))
				})?;
				continue;
			}
		}

		let mut outfile = fs::File::create(&outpath).map_err(|e| {
			wrap(
				e,
				format!(
					"unable to open file to write {} (from {:?})",
					outpath.display(),
					file.enclosed_name().map(|p| p.to_string_lossy()),
				),
			)
		})?;

		io::copy(&mut file, &mut outfile)
			.map_err(|e| wrap(e, format!("error copying file {}", outpath.display())))?;

		apply_permissions(&file, &outpath)?;
	}

	reporter.report_progress(archive.len() as u64, archive.len() as u64);

	Ok(())
}

#[cfg(unix)]
fn apply_permissions(file: &ZipFile, outpath: &Path) -> Result<(), WrappedError> {
	use std::os::unix::fs::PermissionsExt;

	if let Some(mode) = file.unix_mode() {
		fs::set_permissions(outpath, fs::Permissions::from_mode(mode)).map_err(|e| {
			wrap(
				e,
				format!("error setting permissions on {}", outpath.display()),
			)
		})?;
	}

	Ok(())
}

#[cfg(windows)]
fn apply_permissions(_file: &ZipFile, _outpath: &Path) -> Result<(), WrappedError> {
	Ok(())
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/.npmrc]---
Location: vscode-main/extensions/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/cgmanifest.json]---
Location: vscode-main/extensions/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "typescript",
					"repositoryUrl": "https://github.com/microsoft/TypeScript",
					"commitHash": "54426a14f4c232da8e563d20ca8e71263e1c96b5"
				}
			},
			"isOnlyProductionDependency": true,
			"license": "Apache-2.0",
			"version": "2.6.2"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/esbuild-webview-common.mjs]---
Location: vscode-main/extensions/esbuild-webview-common.mjs

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
/**
 * @fileoverview Common build script for extension scripts used in in webviews.
 */
import path from 'node:path';
import esbuild from 'esbuild';

/**
 * @typedef {Partial<import('esbuild').BuildOptions> & {
 * 	entryPoints: string[] | Record<string, string> | { in: string, out: string }[];
 * 	outdir: string;
 * }} BuildOptions
 */

/**
 * Build the source code once using esbuild.
 *
 * @param {BuildOptions} options
 * @param {(outDir: string) => unknown} [didBuild]
 */
async function build(options, didBuild) {
	await esbuild.build({
		bundle: true,
		minify: true,
		sourcemap: false,
		format: 'esm',
		platform: 'browser',
		target: ['es2024'],
		...options,
	});

	await didBuild?.(options.outdir);
}

/**
 * Build the source code once using esbuild, logging errors instead of throwing.
 *
 * @param {BuildOptions} options
 * @param {(outDir: string) => unknown} [didBuild]
 */
async function tryBuild(options, didBuild) {
	try {
		await build(options, didBuild);
	} catch (err) {
		console.error(err);
	}
}

/**
 * @param {{
 * 	srcDir: string;
 *  outdir: string;
 *  entryPoints: string[] | Record<string, string> | { in: string, out: string }[];
 * 	additionalOptions?: Partial<import('esbuild').BuildOptions>
 * }} config
 * @param {string[]} args
 * @param {(outDir: string) => unknown} [didBuild]
 */
export async function run(config, args, didBuild) {
	let outdir = config.outdir;
	const outputRootIndex = args.indexOf('--outputRoot');
	if (outputRootIndex >= 0) {
		const outputRoot = args[outputRootIndex + 1];
		const outputDirName = path.basename(outdir);
		outdir = path.join(outputRoot, outputDirName);
	}

	/** @type {BuildOptions} */
	const resolvedOptions = {
		entryPoints: config.entryPoints,
		outdir,
		logOverride: {
			'import-is-undefined': 'error',
		},
		...(config.additionalOptions || {}),
	};

	const isWatch = args.indexOf('--watch') >= 0;
	if (isWatch) {
		await tryBuild(resolvedOptions, didBuild);
		const watcher = await import('@parcel/watcher');
		watcher.subscribe(config.srcDir, () => tryBuild(resolvedOptions, didBuild));
	} else {
		return build(resolvedOptions, didBuild).catch(() => process.exit(1));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/mangle-loader.js]---
Location: vscode-main/extensions/mangle-loader.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check

const fs = require('fs');
const webpack = require('webpack');
const fancyLog = require('fancy-log');
const ansiColors = require('ansi-colors');
const { Mangler } = require('../build/lib/mangle/index.js');

/**
 * Map of project paths to mangled file contents
 *
 * @type {Map<string, Promise<Map<string, { out: string; sourceMap?: string }>>>}
 */
const mangleMap = new Map();

/**
 * @param {string} projectPath
 */
function getMangledFileContents(projectPath) {
	let entry = mangleMap.get(projectPath);
	if (!entry) {
		const log = (...data) => fancyLog(ansiColors.blue('[mangler]'), ...data);
		log(`Mangling ${projectPath}`);
		const ts2tsMangler = new Mangler(projectPath, log, { mangleExports: true, manglePrivateFields: true });
		entry = ts2tsMangler.computeNewFileContents();
		mangleMap.set(projectPath, entry);
	}

	return entry;
}

/**
 * @type {webpack.LoaderDefinitionFunction}
 */
module.exports = async function (source, sourceMap, meta) {
	if (this.mode !== 'production') {
		// Only enable mangling in production builds
		return source;
	}
	if (true) {
		// disable mangling for now, SEE https://github.com/microsoft/vscode/issues/204692
		return source;
	}
	const options = this.getOptions();
	if (options.disabled) {
		// Dynamically disabled
		return source;
	}

	if (source !== fs.readFileSync(this.resourcePath).toString()) {
		// File content has changed by previous webpack steps.
		// Skip mangling.
		return source;
	}

	const callback = this.async();

	const fileContentsMap = await getMangledFileContents(options.configFile);

	const newContents = fileContentsMap.get(this.resourcePath);
	callback(null, newContents?.out ?? source, sourceMap, meta);
};
```

--------------------------------------------------------------------------------

---[FILE: extensions/package-lock.json]---
Location: vscode-main/extensions/package-lock.json

```json
{
  "name": "vscode-extensions",
  "version": "0.0.1",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "vscode-extensions",
      "version": "0.0.1",
      "hasInstallScript": true,
      "license": "MIT",
      "dependencies": {
        "typescript": "^5.9.3"
      },
      "devDependencies": {
        "@parcel/watcher": "parcel-bundler/watcher#1ca032aa8339260a8a3bcf825c3a1a71e3e43542",
        "esbuild": "0.25.0",
        "vscode-grammar-updater": "^1.1.0"
      }
    },
    "node_modules/@esbuild/aix-ppc64": {
      "version": "0.25.0",
      "resolved": "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.25.0.tgz",
      "integrity": "sha512-O7vun9Sf8DFjH2UtqK8Ku3LkquL9SZL8OLY1T5NZkA34+wG3OQF7cl4Ql8vdNzM6fzBbYfLaiRLIOZ+2FOCgBQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "aix"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm": {
      "version": "0.25.0",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.25.0.tgz",
      "integrity": "sha512-PTyWCYYiU0+1eJKmw21lWtC+d08JDZPQ5g+kFyxP0V+es6VPPSUhM6zk8iImp2jbV6GwjX4pap0JFbUQN65X1g==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm64": {
      "version": "0.25.0",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.25.0.tgz",
      "integrity": "sha512-grvv8WncGjDSyUBjN9yHXNt+cq0snxXbDxy5pJtzMKGmmpPxeAmAhWxXI+01lU5rwZomDgD3kJwulEnhTRUd6g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-x64": {
      "version": "0.25.0",
      "resolved": "https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.25.0.tgz",
      "integrity": "sha512-m/ix7SfKG5buCnxasr52+LI78SQ+wgdENi9CqyCXwjVR2X4Jkz+BpC3le3AoBPYTC9NHklwngVXvbJ9/Akhrfg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-arm64": {
      "version": "0.25.0",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.25.0.tgz",
      "integrity": "sha512-mVwdUb5SRkPayVadIOI78K7aAnPamoeFR2bT5nszFUZ9P8UpK4ratOdYbZZXYSqPKMHfS1wdHCJk1P1EZpRdvw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-x64": {
      "version": "0.25.0",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.25.0.tgz",
      "integrity": "sha512-DgDaYsPWFTS4S3nWpFcMn/33ZZwAAeAFKNHNa1QN0rI4pUjgqf0f7ONmXf6d22tqTY+H9FNdgeaAa+YIFUn2Rg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-arm64": {
      "version": "0.25.0",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.25.0.tgz",
      "integrity": "sha512-VN4ocxy6dxefN1MepBx/iD1dH5K8qNtNe227I0mnTRjry8tj5MRk4zprLEdG8WPyAPb93/e4pSgi1SoHdgOa4w==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-x64": {
      "version": "0.25.0",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.25.0.tgz",
      "integrity": "sha512-mrSgt7lCh07FY+hDD1TxiTyIHyttn6vnjesnPoVDNmDfOmggTLXRv8Id5fNZey1gl/V2dyVK1VXXqVsQIiAk+A==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm": {
      "version": "0.25.0",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.25.0.tgz",
      "integrity": "sha512-vkB3IYj2IDo3g9xX7HqhPYxVkNQe8qTK55fraQyTzTX/fxaDtXiEnavv9geOsonh2Fd2RMB+i5cbhu2zMNWJwg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm64": {
      "version": "0.25.0",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.25.0.tgz",
      "integrity": "sha512-9QAQjTWNDM/Vk2bgBl17yWuZxZNQIF0OUUuPZRKoDtqF2k4EtYbpyiG5/Dk7nqeK6kIJWPYldkOcBqjXjrUlmg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ia32": {
      "version": "0.25.0",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ia32/-/linux-ia32-0.25.0.tgz",
      "integrity": "sha512-43ET5bHbphBegyeqLb7I1eYn2P/JYGNmzzdidq/w0T8E2SsYL1U6un2NFROFRg1JZLTzdCoRomg8Rvf9M6W6Gg==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-loong64": {
      "version": "0.25.0",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.25.0.tgz",
      "integrity": "sha512-fC95c/xyNFueMhClxJmeRIj2yrSMdDfmqJnyOY4ZqsALkDrrKJfIg5NTMSzVBr5YW1jf+l7/cndBfP3MSDpoHw==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-mips64el": {
      "version": "0.25.0",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-mips64el/-/linux-mips64el-0.25.0.tgz",
      "integrity": "sha512-nkAMFju7KDW73T1DdH7glcyIptm95a7Le8irTQNO/qtkoyypZAnjchQgooFUDQhNAy4iu08N79W4T4pMBwhPwQ==",
      "cpu": [
        "mips64el"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ppc64": {
      "version": "0.25.0",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ppc64/-/linux-ppc64-0.25.0.tgz",
      "integrity": "sha512-NhyOejdhRGS8Iwv+KKR2zTq2PpysF9XqY+Zk77vQHqNbo/PwZCzB5/h7VGuREZm1fixhs4Q/qWRSi5zmAiO4Fw==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-riscv64": {
      "version": "0.25.0",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-riscv64/-/linux-riscv64-0.25.0.tgz",
      "integrity": "sha512-5S/rbP5OY+GHLC5qXp1y/Mx//e92L1YDqkiBbO9TQOvuFXM+iDqUNG5XopAnXoRH3FjIUDkeGcY1cgNvnXp/kA==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-s390x": {
      "version": "0.25.0",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-s390x/-/linux-s390x-0.25.0.tgz",
      "integrity": "sha512-XM2BFsEBz0Fw37V0zU4CXfcfuACMrppsMFKdYY2WuTS3yi8O1nFOhil/xhKTmE1nPmVyvQJjJivgDT+xh8pXJA==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-x64": {
      "version": "0.25.0",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.25.0.tgz",
      "integrity": "sha512-9yl91rHw/cpwMCNytUDxwj2XjFpxML0y9HAOH9pNVQDpQrBxHy01Dx+vaMu0N1CKa/RzBD2hB4u//nfc+Sd3Cw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-arm64": {
      "version": "0.25.0",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-arm64/-/netbsd-arm64-0.25.0.tgz",
      "integrity": "sha512-RuG4PSMPFfrkH6UwCAqBzauBWTygTvb1nxWasEJooGSJ/NwRw7b2HOwyRTQIU97Hq37l3npXoZGYMy3b3xYvPw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-x64": {
      "version": "0.25.0",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.25.0.tgz",
      "integrity": "sha512-jl+qisSB5jk01N5f7sPCsBENCOlPiS/xptD5yxOx2oqQfyourJwIKLRA2yqWdifj3owQZCL2sn6o08dBzZGQzA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-arm64": {
      "version": "0.25.0",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-arm64/-/openbsd-arm64-0.25.0.tgz",
      "integrity": "sha512-21sUNbq2r84YE+SJDfaQRvdgznTD8Xc0oc3p3iW/a1EVWeNj/SdUCbm5U0itZPQYRuRTW20fPMWMpcrciH2EJw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-x64": {
      "version": "0.25.0",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.25.0.tgz",
      "integrity": "sha512-2gwwriSMPcCFRlPlKx3zLQhfN/2WjJ2NSlg5TKLQOJdV0mSxIcYNTMhk3H3ulL/cak+Xj0lY1Ym9ysDV1igceg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/sunos-x64": {
      "version": "0.25.0",
      "resolved": "https://registry.npmjs.org/@esbuild/sunos-x64/-/sunos-x64-0.25.0.tgz",
      "integrity": "sha512-bxI7ThgLzPrPz484/S9jLlvUAHYMzy6I0XiU1ZMeAEOBcS0VePBFxh1JjTQt3Xiat5b6Oh4x7UC7IwKQKIJRIg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "sunos"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-arm64": {
      "version": "0.25.0",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-arm64/-/win32-arm64-0.25.0.tgz",
      "integrity": "sha512-ZUAc2YK6JW89xTbXvftxdnYy3m4iHIkDtK3CLce8wg8M2L+YZhIvO1DKpxrd0Yr59AeNNkTiic9YLf6FTtXWMw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-ia32": {
      "version": "0.25.0",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-ia32/-/win32-ia32-0.25.0.tgz",
      "integrity": "sha512-eSNxISBu8XweVEWG31/JzjkIGbGIJN/TrRoiSVZwZ6pkC6VX4Im/WV2cz559/TXLcYbcrDN8JtKgd9DJVIo8GA==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-x64": {
      "version": "0.25.0",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-0.25.0.tgz",
      "integrity": "sha512-ZENoHJBxA20C2zFzh6AI4fT6RraMzjYw4xKWemRTRmRVtN9c5DcH9r/f2ihEkMjOW5eGgrwCslG/+Y/3bL+DHQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@parcel/watcher": {
      "version": "2.5.1",
      "resolved": "git+ssh://git@github.com/parcel-bundler/watcher.git#1ca032aa8339260a8a3bcf825c3a1a71e3e43542",
      "integrity": "sha512-Z0lk8pM5vwuOJU6pfheRXHrOpQYIIEnVl/z8DY6370D4+ZnrOTvFa5BUdf3pGxahT5ILbPWwQSm2Wthy4q1OTg==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "dependencies": {
        "detect-libc": "^2.0.3",
        "is-glob": "^4.0.3",
        "micromatch": "^4.0.5",
        "node-addon-api": "^7.0.0"
      },
      "engines": {
        "node": ">= 10.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/braces": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/braces/-/braces-3.0.3.tgz",
      "integrity": "sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==",
      "dev": true,
      "dependencies": {
        "fill-range": "^7.1.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/coffeescript": {
      "version": "1.12.7",
      "resolved": "https://registry.npmjs.org/coffeescript/-/coffeescript-1.12.7.tgz",
      "integrity": "sha512-pLXHFxQMPklVoEekowk8b3erNynC+DVJzChxS/LCBBgR6/8AJkHivkm//zbowcfc7BTCAjryuhx6gPqPRfsFoA==",
      "dev": true,
      "bin": {
        "cake": "bin/cake",
        "coffee": "bin/coffee"
      },
      "engines": {
        "node": ">=0.8.0"
      }
    },
    "node_modules/cson-parser": {
      "version": "4.0.9",
      "resolved": "https://registry.npmjs.org/cson-parser/-/cson-parser-4.0.9.tgz",
      "integrity": "sha512-I79SAcCYquWnEfXYj8hBqOOWKj6eH6zX1hhX3yqmS4K3bYp7jME3UFpHPzu3rUew0oyfc0s8T6IlWGXRAheHag==",
      "dev": true,
      "dependencies": {
        "coffeescript": "1.12.7"
      },
      "engines": {
        "node": ">=10.13"
      }
    },
    "node_modules/detect-libc": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/detect-libc/-/detect-libc-2.0.4.tgz",
      "integrity": "sha512-3UDv+G9CsCKO1WKMGw9fwq/SWJYbI0c5Y7LU1AXYoDdbhE2AHQ6N6Nb34sG8Fj7T5APy8qXDCKuuIHd1BR0tVA==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/esbuild": {
      "version": "0.25.0",
      "resolved": "https://registry.npmjs.org/esbuild/-/esbuild-0.25.0.tgz",
      "integrity": "sha512-BXq5mqc8ltbaN34cDqWuYKyNhX8D/Z0J1xdtdQ8UcIIIyJyz+ZMKUt58tF3SrZ85jcfN/PZYhjR5uDQAYNVbuw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "bin": {
        "esbuild": "bin/esbuild"
      },
      "engines": {
        "node": ">=18"
      },
      "optionalDependencies": {
        "@esbuild/aix-ppc64": "0.25.0",
        "@esbuild/android-arm": "0.25.0",
        "@esbuild/android-arm64": "0.25.0",
        "@esbuild/android-x64": "0.25.0",
        "@esbuild/darwin-arm64": "0.25.0",
        "@esbuild/darwin-x64": "0.25.0",
        "@esbuild/freebsd-arm64": "0.25.0",
        "@esbuild/freebsd-x64": "0.25.0",
        "@esbuild/linux-arm": "0.25.0",
        "@esbuild/linux-arm64": "0.25.0",
        "@esbuild/linux-ia32": "0.25.0",
        "@esbuild/linux-loong64": "0.25.0",
        "@esbuild/linux-mips64el": "0.25.0",
        "@esbuild/linux-ppc64": "0.25.0",
        "@esbuild/linux-riscv64": "0.25.0",
        "@esbuild/linux-s390x": "0.25.0",
        "@esbuild/linux-x64": "0.25.0",
        "@esbuild/netbsd-arm64": "0.25.0",
        "@esbuild/netbsd-x64": "0.25.0",
        "@esbuild/openbsd-arm64": "0.25.0",
        "@esbuild/openbsd-x64": "0.25.0",
        "@esbuild/sunos-x64": "0.25.0",
        "@esbuild/win32-arm64": "0.25.0",
        "@esbuild/win32-ia32": "0.25.0",
        "@esbuild/win32-x64": "0.25.0"
      }
    },
    "node_modules/fast-plist": {
      "version": "0.1.2",
      "resolved": "https://registry.npmjs.org/fast-plist/-/fast-plist-0.1.2.tgz",
      "integrity": "sha1-pFr/NFGWAG1AbKbNzQX2kFHvNbg= sha512-2HxzrqJhmMoxVzARjYFvkzkL2dCBB8sogU5sD8gqcZWv5UCivK9/cXM9KIPDRwU+eD3mbRDN/GhW8bO/4dtMfg==",
      "dev": true
    },
    "node_modules/fill-range": {
      "version": "7.1.1",
      "resolved": "https://registry.npmjs.org/fill-range/-/fill-range-7.1.1.tgz",
      "integrity": "sha512-YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==",
      "dev": true,
      "dependencies": {
        "to-regex-range": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/is-extglob": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/is-extglob/-/is-extglob-2.1.1.tgz",
      "integrity": "sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-glob": {
      "version": "4.0.3",
      "resolved": "https://registry.npmjs.org/is-glob/-/is-glob-4.0.3.tgz",
      "integrity": "sha512-xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg==",
      "dev": true,
      "dependencies": {
        "is-extglob": "^2.1.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-number": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/is-number/-/is-number-7.0.0.tgz",
      "integrity": "sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==",
      "dev": true,
      "engines": {
        "node": ">=0.12.0"
      }
    },
    "node_modules/micromatch": {
      "version": "4.0.8",
      "resolved": "https://registry.npmjs.org/micromatch/-/micromatch-4.0.8.tgz",
      "integrity": "sha512-PXwfBhYu0hBCPw8Dn0E+WDYb7af3dSLVWKi3HGv84IdF4TyFoC0ysxFd0Goxw7nSv4T/PzEJQxsYsEiFCKo2BA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "braces": "^3.0.3",
        "picomatch": "^2.3.1"
      },
      "engines": {
        "node": ">=8.6"
      }
    },
    "node_modules/node-addon-api": {
      "version": "7.1.0",
      "resolved": "https://registry.npmjs.org/node-addon-api/-/node-addon-api-7.1.0.tgz",
      "integrity": "sha512-mNcltoe1R8o7STTegSOHdnJNN7s5EUvhoS7ShnTHDyOSd+8H+UdWODq6qSv67PjC8Zc5JRT8+oLAMCr0SIXw7g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^16 || ^18 || >= 20"
      }
    },
    "node_modules/picomatch": {
      "version": "2.3.1",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-2.3.1.tgz",
      "integrity": "sha512-JU3teHTNjmE2VCGFzuY8EXzCDVwEqB2a8fsIvwaStHhAWJEeVd1o1QD80CU6+ZdEXXSLbSsuLwJjkCBWqRQUVA==",
      "dev": true,
      "engines": {
        "node": ">=8.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/to-regex-range": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/to-regex-range/-/to-regex-range-5.0.1.tgz",
      "integrity": "sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==",
      "dev": true,
      "dependencies": {
        "is-number": "^7.0.0"
      },
      "engines": {
        "node": ">=8.0"
      }
    },
    "node_modules/typescript": {
      "version": "5.9.3",
      "resolved": "https://registry.npmjs.org/typescript/-/typescript-5.9.3.tgz",
      "integrity": "sha512-jl1vZzPDinLr9eUt3J/t7V6FgNEw9QjvBPdysz9KfQDD41fQrC2Y4vKQdiaUpFT4bXlb1RHhLpp8wtm6M5TgSw==",
      "license": "Apache-2.0",
      "bin": {
        "tsc": "bin/tsc",
        "tsserver": "bin/tsserver"
      },
      "engines": {
        "node": ">=14.17"
      }
    },
    "node_modules/vscode-grammar-updater": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/vscode-grammar-updater/-/vscode-grammar-updater-1.1.0.tgz",
      "integrity": "sha512-rWcJXyEFK27Mh9bxfBTLaul0KiGQk0GMXj2qTDH9cy3UZVx5MrF035B03os1w4oIXwl/QDhdLnsBK0j2SNiL1A==",
      "dev": true,
      "dependencies": {
        "cson-parser": "^4.0.9",
        "fast-plist": "0.1.2"
      },
      "bin": {
        "vscode-grammar-updater": "bin.js"
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/package.json]---
Location: vscode-main/extensions/package.json

```json
{
  "name": "vscode-extensions",
  "version": "0.0.1",
  "license": "MIT",
  "description": "Dependencies shared by all extensions",
  "dependencies": {
    "typescript": "^5.9.3"
  },
  "scripts": {
    "postinstall": "node ./postinstall.mjs"
  },
  "devDependencies": {
    "@parcel/watcher": "parcel-bundler/watcher#1ca032aa8339260a8a3bcf825c3a1a71e3e43542",
    "esbuild": "0.25.0",
    "vscode-grammar-updater": "^1.1.0"
  },
  "overrides": {
    "node-gyp-build": "4.8.1"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/postinstall.mjs]---
Location: vscode-main/extensions/postinstall.mjs

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'node_modules', 'typescript');

function processRoot() {
	const toKeep = new Set([
		'lib',
		'package.json',
	]);
	for (const name of fs.readdirSync(root)) {
		if (!toKeep.has(name)) {
			const filePath = path.join(root, name);
			console.log(`Removed ${filePath}`);
			fs.rmSync(filePath, { recursive: true });
		}
	}
}

function processLib() {
	const toDelete = new Set([
		'tsc.js',
		'_tsc.js',

		'typescriptServices.js',
		'_typescriptServices.js',
	]);

	const libRoot = path.join(root, 'lib');

	for (const name of fs.readdirSync(libRoot)) {
		if (name === 'lib.d.ts' || name.match(/^lib\..*\.d\.ts$/) || name === 'protocol.d.ts') {
			continue;
		}
		if (name === 'typescript.js' || name === 'typescript.d.ts') {
			// used by html and extension editing
			continue;
		}

		if (toDelete.has(name) || name.match(/\.d\.ts$/)) {
			try {
				fs.unlinkSync(path.join(libRoot, name));
				console.log(`removed '${path.join(libRoot, name)}'`);
			} catch (e) {
				console.warn(e);
			}
		}
	}
}

processRoot();
processLib();
```

--------------------------------------------------------------------------------

---[FILE: extensions/shared.webpack.config.mjs]---
Location: vscode-main/extensions/shared.webpack.config.mjs

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import path from 'node:path';
import fs from 'node:fs';
import merge from 'merge-options';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import webpack from 'webpack';
import { createRequire } from 'node:module';

/** @typedef {import('webpack').Configuration} WebpackConfig **/

const require = createRequire(import.meta.url);

const tsLoaderOptions = {
	compilerOptions: {
		'sourceMap': true,
	},
	onlyCompileBundledFiles: true,
};

function withNodeDefaults(/**@type WebpackConfig & { context: string }*/extConfig) {
	const defaultConfig = {
		mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
		target: 'node', // extensions run in a node context
		node: {
			__dirname: false // leave the __dirname-behaviour intact
		},

		resolve: {
			conditionNames: ['import', 'require', 'node-addons', 'node'],
			mainFields: ['module', 'main'],
			extensions: ['.ts', '.js'], // support ts-files and js-files
			extensionAlias: {
				// this is needed to resolve dynamic imports that now require the .js extension
				'.js': ['.js', '.ts'],
			}
		},
		module: {
			rules: [{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [
					{
						// configure TypeScript loader:
						// * enable sources maps for end-to-end source maps
						loader: 'ts-loader',
						options: tsLoaderOptions
					},
					// disable mangling for now, SEE https://github.com/microsoft/vscode/issues/204692
					// {
					// 	loader: path.resolve(import.meta.dirname, 'mangle-loader.js'),
					// 	options: {
					// 		configFile: path.join(extConfig.context, 'tsconfig.json')
					// 	},
					// },
				]
			}]
		},
		externals: {
			'electron': 'commonjs electron', // ignored to avoid bundling from node_modules
			'vscode': 'commonjs vscode', // ignored because it doesn't exist,
			'applicationinsights-native-metrics': 'commonjs applicationinsights-native-metrics', // ignored because we don't ship native module
			'@azure/functions-core': 'commonjs azure/functions-core', // optional dependency of appinsights that we don't use
			'@opentelemetry/tracing': 'commonjs @opentelemetry/tracing', // ignored because we don't ship this module
			'@opentelemetry/instrumentation': 'commonjs @opentelemetry/instrumentation', // ignored because we don't ship this module
			'@azure/opentelemetry-instrumentation-azure-sdk': 'commonjs @azure/opentelemetry-instrumentation-azure-sdk', // ignored because we don't ship this module
		},
		output: {
			// all output goes into `dist`.
			// packaging depends on that and this must always be like it
			filename: '[name].js',
			path: path.join(extConfig.context, 'dist'),
			libraryTarget: 'commonjs',
		},
		// yes, really source maps
		devtool: 'source-map',
		plugins: nodePlugins(extConfig.context),
	};

	return merge(defaultConfig, extConfig);
}

/**
 *
 * @param {string} context
 */
function nodePlugins(context) {
	// Need to find the top-most `package.json` file
	const folderName = path.relative(import.meta.dirname, context).split(/[\\\/]/)[0];
	const pkgPath = path.join(import.meta.dirname, folderName, 'package.json');
	const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
	const id = `${pkg.publisher}.${pkg.name}`;
	return [
		new CopyWebpackPlugin({
			patterns: [
				{ from: 'src', to: '.', globOptions: { ignore: ['**/test/**', '**/*.ts'] }, noErrorOnMissing: true }
			]
		})
	];
}
/**
 * @typedef {{
 * 	configFile?: string
 * }} AdditionalBrowserConfig
 */

function withBrowserDefaults(/**@type WebpackConfig & { context: string }*/extConfig, /** @type AdditionalBrowserConfig */ additionalOptions = {}) {
	/** @type WebpackConfig */
	const defaultConfig = {
		mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
		target: 'webworker', // extensions run in a webworker context
		resolve: {
			mainFields: ['browser', 'module', 'main'],
			extensions: ['.ts', '.js'], // support ts-files and js-files
			fallback: {
				'path': require.resolve('path-browserify'),
				'os': require.resolve('os-browserify'),
				'util': require.resolve('util')
			},
			extensionAlias: {
				// this is needed to resolve dynamic imports that now require the .js extension
				'.js': ['.js', '.ts'],
			},
		},
		module: {
			rules: [{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [
					{
						// configure TypeScript loader:
						// * enable sources maps for end-to-end source maps
						loader: 'ts-loader',
						options: {
							...tsLoaderOptions,
							//							...(additionalOptions ? {} : { configFile: additionalOptions.configFile }),
						}
					},
					// disable mangling for now, SEE https://github.com/microsoft/vscode/issues/204692
					// {
					// 	loader: path.resolve(import.meta.dirname, 'mangle-loader.js'),
					// 	options: {
					// 		configFile: path.join(extConfig.context, additionalOptions?.configFile ?? 'tsconfig.json')
					// 	},
					// },
				]
			}, {
				test: /\.wasm$/,
				type: 'asset/inline'
			}]
		},
		externals: {
			'vscode': 'commonjs vscode', // ignored because it doesn't exist,
			'applicationinsights-native-metrics': 'commonjs applicationinsights-native-metrics', // ignored because we don't ship native module
			'@azure/functions-core': 'commonjs azure/functions-core', // optional dependency of appinsights that we don't use
			'@opentelemetry/tracing': 'commonjs @opentelemetry/tracing', // ignored because we don't ship this module
			'@opentelemetry/instrumentation': 'commonjs @opentelemetry/instrumentation', // ignored because we don't ship this module
			'@azure/opentelemetry-instrumentation-azure-sdk': 'commonjs @azure/opentelemetry-instrumentation-azure-sdk', // ignored because we don't ship this module
		},
		performance: {
			hints: false
		},
		output: {
			// all output goes into `dist`.
			// packaging depends on that and this must always be like it
			filename: '[name].js',
			path: path.join(extConfig.context, 'dist', 'browser'),
			libraryTarget: 'commonjs',
		},
		// yes, really source maps
		devtool: 'source-map',
		plugins: browserPlugins(extConfig.context)
	};

	return merge(defaultConfig, extConfig);
}

/**
 *
 * @param {string} context
 */
function browserPlugins(context) {
	// Need to find the top-most `package.json` file
	// const folderName = path.relative(__dirname, context).split(/[\\\/]/)[0];
	// const pkgPath = path.join(__dirname, folderName, 'package.json');
	// const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
	// const id = `${pkg.publisher}.${pkg.name}`;
	return [
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: 'src', to: '.', globOptions: { ignore: ['**/test/**', '**/*.ts'] }, noErrorOnMissing: true }
			]
		}),
		new webpack.DefinePlugin({
			'process.platform': JSON.stringify('web'),
			'process.env': JSON.stringify({}),
			'process.env.BROWSER_ENV': JSON.stringify('true')
		})
	];
}

export default withNodeDefaults;
export { withNodeDefaults as node, withBrowserDefaults as browser, nodePlugins, browserPlugins };
```

--------------------------------------------------------------------------------

---[FILE: extensions/tsconfig.base.json]---
Location: vscode-main/extensions/tsconfig.base.json

```json
{
	"compilerOptions": {
		"esModuleInterop": true,
		"target": "ES2024",
		"lib": [
			"ES2024"
		],
		"module": "commonjs",
		"strict": true,
		"exactOptionalPropertyTypes": false,
		"useUnknownInCatchVariables": false,
		"alwaysStrict": true,
		"noImplicitAny": true,
		"noImplicitReturns": true,
		"noImplicitOverride": true,
		"noUnusedLocals": true,
		"noUnusedParameters": true,
		"forceConsistentCasingInFileNames": true
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/bat/.vscodeignore]---
Location: vscode-main/extensions/bat/.vscodeignore

```text
test/**
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/bat/cgmanifest.json]---
Location: vscode-main/extensions/bat/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "mmims/language-batchfile",
					"repositoryUrl": "https://github.com/mmims/language-batchfile",
					"commitHash": "6154ae25a24e01ac9329e7bcf958e093cd8733a9"
				}
			},
			"license": "MIT",
			"version": "0.7.6"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/bat/language-configuration.json]---
Location: vscode-main/extensions/bat/language-configuration.json

```json
{
	"comments": {
		"lineComment": "@REM"
	},
	"brackets": [
		["{", "}"],
		["[", "]"],
		["(", ")"]
	],
	"autoClosingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		{ "open": "\"", "close": "\"", "notIn": ["string"] }
	],
	"surroundingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["%", "%"],
		["\"", "\""]
	],
	"folding": {
		"markers": {
			"start": "^\\s*(::|REM|@REM)\\s*#region",
			"end": "^\\s*(::|REM|@REM)\\s*#endregion"
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/bat/package.json]---
Location: vscode-main/extensions/bat/package.json

```json
{
  "name": "bat",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "^1.52.0"
  },
  "scripts": {
    "update-grammar": "node ../node_modules/vscode-grammar-updater/bin mmims/language-batchfile grammars/batchfile.cson ./syntaxes/batchfile.tmLanguage.json"
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [
      {
        "id": "bat",
        "extensions": [
          ".bat",
          ".cmd"
        ],
        "aliases": [
          "Batch",
          "bat"
        ],
        "configuration": "./language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "bat",
        "scopeName": "source.batchfile",
        "path": "./syntaxes/batchfile.tmLanguage.json"
      }
    ],
    "snippets": [
      {
        "language": "bat",
        "path": "./snippets/batchfile.code-snippets"
      }
    ]
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/bat/package.nls.json]---
Location: vscode-main/extensions/bat/package.nls.json

```json
{
	"displayName": "Windows Bat Language Basics",
	"description": "Provides snippets, syntax highlighting, bracket matching and folding in Windows batch files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/bat/snippets/batchfile.code-snippets]---
Location: vscode-main/extensions/bat/snippets/batchfile.code-snippets

```text
{
	"Region Start": {
		"prefix": "#region",
		"body": [
			"::#region"
		],
		"description": "Folding Region Start"
	},
	"Region End": {
		"prefix": "#endregion",
		"body": [
			"::#endregion"
		],
		"description": "Folding Region End"
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/bat/syntaxes/batchfile.tmLanguage.json]---
Location: vscode-main/extensions/bat/syntaxes/batchfile.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/mmims/language-batchfile/blob/master/grammars/batchfile.cson",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/mmims/language-batchfile/commit/6154ae25a24e01ac9329e7bcf958e093cd8733a9",
	"name": "Batch File",
	"scopeName": "source.batchfile",
	"injections": {
		"L:meta.block.repeat.batchfile": {
			"patterns": [
				{
					"include": "#repeatParameter"
				}
			]
		}
	},
	"patterns": [
		{
			"include": "#commands"
		},
		{
			"include": "#comments"
		},
		{
			"include": "#constants"
		},
		{
			"include": "#controls"
		},
		{
			"include": "#escaped_characters"
		},
		{
			"include": "#labels"
		},
		{
			"include": "#numbers"
		},
		{
			"include": "#operators"
		},
		{
			"include": "#parens"
		},
		{
			"include": "#strings"
		},
		{
			"include": "#variables"
		}
	],
	"repository": {
		"commands": {
			"patterns": [
				{
					"match": "(?<=^|[\\s@])(?i:adprep|append|arp|assoc|at|atmadm|attrib|auditpol|autochk|autoconv|autofmt|bcdboot|bcdedit|bdehdcfg|bitsadmin|bootcfg|brea|cacls|cd|certreq|certutil|change|chcp|chdir|chglogon|chgport|chgusr|chkdsk|chkntfs|choice|cipher|clip|cls|clscluadmin|cluster|cmd|cmdkey|cmstp|color|comp|compact|convert|copy|cprofile|cscript|csvde|date|dcdiag|dcgpofix|dcpromo|defra|del|dfscmd|dfsdiag|dfsrmig|diantz|dir|dirquota|diskcomp|diskcopy|diskpart|diskperf|diskraid|diskshadow|dispdiag|doin|dnscmd|doskey|driverquery|dsacls|dsadd|dsamain|dsdbutil|dsget|dsmgmt|dsmod|dsmove|dsquery|dsrm|edit|endlocal|eraseesentutl|eventcreate|eventquery|eventtriggers|evntcmd|expand|extract|fc|filescrn|find|findstr|finger|flattemp|fonde|forfiles|format|freedisk|fsutil|ftp|ftype|fveupdate|getmac|gettype|gpfixup|gpresult|gpupdate|graftabl|hashgen|hep|helpctr|hostname|icacls|iisreset|inuse|ipconfig|ipxroute|irftp|ismserv|jetpack|klist|ksetup|ktmutil|ktpass|label|ldifd|ldp|lodctr|logman|logoff|lpq|lpr|macfile|makecab|manage-bde|mapadmin|md|mkdir|mklink|mmc|mode|more|mount|mountvol|move|mqbup|mqsvc|mqtgsvc|msdt|msg|msiexec|msinfo32|mstsc|nbtstat|net computer|net group|net localgroup|net print|net session|net share|net start|net stop|net use|net user|net view|net|netcfg|netdiag|netdom|netsh|netstat|nfsadmin|nfsshare|nfsstat|nlb|nlbmgr|nltest|nslookup|ntackup|ntcmdprompt|ntdsutil|ntfrsutl|openfiles|pagefileconfig|path|pathping|pause|pbadmin|pentnt|perfmon|ping|pnpunatten|pnputil|popd|powercfg|powershell|powershell_ise|print|prncnfg|prndrvr|prnjobs|prnmngr|prnport|prnqctl|prompt|pubprn|pushd|pushprinterconnections|pwlauncher|qappsrv|qprocess|query|quser|qwinsta|rasdial|rcp|rd|rdpsign|regentc|recover|redircmp|redirusr|reg|regini|regsvr32|relog|ren|rename|rendom|repadmin|repair-bde|replace|reset session|rxec|risetup|rmdir|robocopy|route|rpcinfo|rpcping|rsh|runas|rundll32|rwinsta|sc|schtasks|scp|scwcmd|secedit|serverceipoptin|servrmanagercmd|serverweroptin|setspn|setx|sfc|sftp|shadow|shift|showmount|shutdown|sort|ssh|ssh-add|ssh-agent|ssh-keygen|ssh-keyscan|start|storrept|subst|sxstrace|ysocmgr|systeminfo|takeown|tapicfg|taskkill|tasklist|tcmsetup|telnet|tftp|time|timeout|title|tlntadmn|tpmvscmgr|tpmvscmgr|tacerpt|tracert|tree|tscon|tsdiscon|tsecimp|tskill|tsprof|type|typeperf|tzutil|uddiconfig|umount|unlodctr|ver|verifier|verif|vol|vssadmin|w32tm|waitfor|wbadmin|wdsutil|wecutil|wevtutil|where|whoami|winnt|winnt32|winpop|winrm|winrs|winsat|wlbs|wmic|wscript|wsl|xcopy)(?=$|\\s)",
					"name": "keyword.command.batchfile"
				},
				{
					"begin": "(?i)(?<=^|[\\s@])(echo)(?:(?=$|\\.|:)|\\s+(?:(on|off)(?=\\s*$))?)",
					"beginCaptures": {
						"1": {
							"name": "keyword.command.batchfile"
						},
						"2": {
							"name": "keyword.other.special-method.batchfile"
						}
					},
					"end": "(?=$\\n|[&|><)])",
					"patterns": [
						{
							"include": "#escaped_characters"
						},
						{
							"include": "#variables"
						},
						{
							"include": "#numbers"
						},
						{
							"include": "#strings"
						}
					]
				},
				{
					"match": "(?i)(?<=^|[\\s@])(setlocal)(?:\\s*$|\\s+(EnableExtensions|DisableExtensions|EnableDelayedExpansion|DisableDelayedExpansion)(?=\\s*$))",
					"captures": {
						"1": {
							"name": "keyword.command.batchfile"
						},
						"2": {
							"name": "keyword.other.special-method.batchfile"
						}
					}
				},
				{
					"include": "#command_set"
				}
			]
		},
		"command_set": {
			"patterns": [
				{
					"begin": "(?<=^|[\\s@])(?i:SET)(?=$|\\s)",
					"beginCaptures": {
						"0": {
							"name": "keyword.command.batchfile"
						}
					},
					"end": "(?=$\\n|[&|><)])",
					"patterns": [
						{
							"include": "#command_set_inside"
						}
					]
				}
			]
		},
		"command_set_inside": {
			"patterns": [
				{
					"include": "#escaped_characters"
				},
				{
					"include": "#variables"
				},
				{
					"include": "#numbers"
				},
				{
					"include": "#parens"
				},
				{
					"include": "#command_set_strings"
				},
				{
					"include": "#strings"
				},
				{
					"begin": "([^ ][^=]*)(=)",
					"beginCaptures": {
						"1": {
							"name": "variable.other.readwrite.batchfile"
						},
						"2": {
							"name": "keyword.operator.assignment.batchfile"
						}
					},
					"end": "(?=$\\n|[&|><)])",
					"patterns": [
						{
							"include": "#escaped_characters"
						},
						{
							"include": "#variables"
						},
						{
							"include": "#numbers"
						},
						{
							"include": "#parens"
						},
						{
							"include": "#strings"
						}
					]
				},
				{
					"begin": "\\s+/[aA]\\s+",
					"end": "(?=$\\n|[&|><)])",
					"name": "meta.expression.set.batchfile",
					"patterns": [
						{
							"begin": "\"",
							"beginCaptures": {
								"0": {
									"name": "punctuation.definition.string.begin.batchfile"
								}
							},
							"end": "\"",
							"endCaptures": {
								"0": {
									"name": "punctuation.definition.string.end.batchfile"
								}
							},
							"name": "string.quoted.double.batchfile",
							"patterns": [
								{
									"include": "#command_set_inside_arithmetic"
								},
								{
									"include": "#command_set_group"
								},
								{
									"include": "#variables"
								}
							]
						},
						{
							"include": "#command_set_inside_arithmetic"
						},
						{
							"include": "#command_set_group"
						}
					]
				},
				{
					"begin": "\\s+/[pP]\\s+",
					"end": "(?=$\\n|[&|><)])",
					"patterns": [
						{
							"include": "#command_set_strings"
						},
						{
							"begin": "([^ ][^=]*)(=)",
							"beginCaptures": {
								"1": {
									"name": "variable.other.readwrite.batchfile"
								},
								"2": {
									"name": "keyword.operator.assignment.batchfile"
								}
							},
							"end": "(?=$\\n|[&|><)])",
							"name": "meta.prompt.set.batchfile",
							"patterns": [
								{
									"include": "#strings"
								}
							]
						}
					]
				}
			]
		},
		"command_set_group": {
			"patterns": [
				{
					"begin": "\\(",
					"beginCaptures": {
						"0": {
							"name": "punctuation.section.group.begin.batchfile"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.group.end.batchfile"
						}
					},
					"patterns": [
						{
							"include": "#command_set_inside_arithmetic"
						}
					]
				}
			]
		},
		"command_set_inside_arithmetic": {
			"patterns": [
				{
					"include": "#command_set_operators"
				},
				{
					"include": "#numbers"
				},
				{
					"match": ",",
					"name": "punctuation.separator.batchfile"
				}
			]
		},
		"command_set_operators": {
			"patterns": [
				{
					"match": "([^ ]*)(\\+\\=|\\-\\=|\\*\\=|\\/\\=|%%\\=|&\\=|\\|\\=|\\^\\=|<<\\=|>>\\=)",
					"captures": {
						"1": {
							"name": "variable.other.readwrite.batchfile"
						},
						"2": {
							"name": "keyword.operator.assignment.augmented.batchfile"
						}
					}
				},
				{
					"match": "\\+|\\-|/|\\*|%%|\\||&|\\^|<<|>>|~",
					"name": "keyword.operator.arithmetic.batchfile"
				},
				{
					"match": "!",
					"name": "keyword.operator.logical.batchfile"
				},
				{
					"match": "([^ =]*)(=)",
					"captures": {
						"1": {
							"name": "variable.other.readwrite.batchfile"
						},
						"2": {
							"name": "keyword.operator.assignment.batchfile"
						}
					}
				}
			]
		},
		"command_set_strings": {
			"patterns": [
				{
					"begin": "(\")\\s*([^ ][^=]*)(=)",
					"beginCaptures": {
						"1": {
							"name": "punctuation.definition.string.begin.batchfile"
						},
						"2": {
							"name": "variable.other.readwrite.batchfile"
						},
						"3": {
							"name": "keyword.operator.assignment.batchfile"
						}
					},
					"end": "\"",
					"endCaptures": {
						"0": {
							"name": "punctuation.definition.string.end.batchfile"
						}
					},
					"name": "string.quoted.double.batchfile",
					"patterns": [
						{
							"include": "#variables"
						},
						{
							"include": "#numbers"
						},
						{
							"include": "#escaped_characters"
						}
					]
				}
			]
		},
		"comments": {
			"patterns": [
				{
					"begin": "(?:^|(&))\\s*(?=((?::[+=,;: ])))",
					"beginCaptures": {
						"1": {
							"name": "keyword.operator.conditional.batchfile"
						}
					},
					"end": "\\n",
					"patterns": [
						{
							"begin": "((?::[+=,;: ]))",
							"beginCaptures": {
								"1": {
									"name": "punctuation.definition.comment.batchfile"
								}
							},
							"end": "(?=\\n)",
							"name": "comment.line.colon.batchfile"
						}
					]
				},
				{
					"begin": "(?<=^|[\\s@])(?i)(REM)(\\.)",
					"beginCaptures": {
						"1": {
							"name": "keyword.command.rem.batchfile"
						},
						"2": {
							"name": "punctuation.separator.batchfile"
						}
					},
					"end": "(?=$\\n|[&|><)])",
					"name": "comment.line.rem.batchfile"
				},
				{
					"begin": "(?<=^|[\\s@])(?i:rem)\\b",
					"beginCaptures": {
						"0": {
							"name": "keyword.command.rem.batchfile"
						}
					},
					"end": "\\n",
					"name": "comment.line.rem.batchfile",
					"patterns": [
						{
							"match": "[><|]",
							"name": "invalid.illegal.unexpected-character.batchfile"
						}
					]
				}
			]
		},
		"constants": {
			"patterns": [
				{
					"match": "\\b(?i:NUL)\\b",
					"name": "constant.language.batchfile"
				}
			]
		},
		"controls": {
			"patterns": [
				{
					"match": "(?i)(?<=^|\\s)(?:call|exit(?=$|\\s)|goto(?=$|\\s|:))",
					"name": "keyword.control.statement.batchfile"
				},
				{
					"match": "(?<=^|\\s)(?i)(if)\\s+(?:(not)\\s+)?(exist|defined|errorlevel|cmdextversion)(?=\\s)",
					"captures": {
						"1": {
							"name": "keyword.control.conditional.batchfile"
						},
						"2": {
							"name": "keyword.operator.logical.batchfile"
						},
						"3": {
							"name": "keyword.other.special-method.batchfile"
						}
					}
				},
				{
					"match": "(?<=^|\\s)(?i)(?:if|else)(?=$|\\s)",
					"name": "keyword.control.conditional.batchfile"
				},
				{
					"begin": "(?<=^|[\\s(&^])(?i)for(?=\\s)",
					"beginCaptures": {
						"0": {
							"name": "keyword.control.repeat.batchfile"
						}
					},
					"name": "meta.block.repeat.batchfile",
					"end": "\\n",
					"patterns": [
						{
							"begin": "(?<=[\\s^])(?i)in(?=\\s)",
							"beginCaptures": {
								"0": {
									"name": "keyword.control.repeat.in.batchfile"
								}
							},
							"end": "(?<=[\\s)^])(?i)do(?=\\s)|\\n",
							"endCaptures": {
								"0": {
									"name": "keyword.control.repeat.do.batchfile"
								}
							},
							"patterns": [
								{
									"include": "$self"
								}
							]
						},
						{
							"include": "$self"
						}
					]
				}
			]
		},
		"escaped_characters": {
			"patterns": [
				{
					"match": "%%|\\^\\^!|\\^(?=.)|\\^\\n",
					"name": "constant.character.escape.batchfile"
				}
			]
		},
		"labels": {
			"patterns": [
				{
					"match": "(?i)(?:^\\s*|(?<=call|goto)\\s*)(:)([^+=,;:\\s]\\S*)",
					"captures": {
						"1": {
							"name": "punctuation.separator.batchfile"
						},
						"2": {
							"name": "keyword.other.special-method.batchfile"
						}
					}
				}
			]
		},
		"numbers": {
			"patterns": [
				{
					"match": "(?<=^|\\s|=)(0[xX][0-9A-Fa-f]*|[+-]?\\d+)(?=$|\\s|<|>)",
					"name": "constant.numeric.batchfile"
				}
			]
		},
		"operators": {
			"patterns": [
				{
					"match": "@(?=\\S)",
					"name": "keyword.operator.at.batchfile"
				},
				{
					"match": "(?<=\\s)(?i:EQU|NEQ|LSS|LEQ|GTR|GEQ)(?=\\s)|==",
					"name": "keyword.operator.comparison.batchfile"
				},
				{
					"match": "(?<=\\s)(?i)(NOT)(?=\\s)",
					"name": "keyword.operator.logical.batchfile"
				},
				{
					"match": "(?<!\\^)&&?|\\|\\|",
					"name": "keyword.operator.conditional.batchfile"
				},
				{
					"match": "(?<!\\^)\\|",
					"name": "keyword.operator.pipe.batchfile"
				},
				{
					"match": "<&?|>[&>]?",
					"name": "keyword.operator.redirection.batchfile"
				}
			]
		},
		"parens": {
			"patterns": [
				{
					"begin": "\\(",
					"beginCaptures": {
						"0": {
							"name": "punctuation.section.group.begin.batchfile"
						}
					},
					"end": "\\)",
					"endCaptures": {
						"0": {
							"name": "punctuation.section.group.end.batchfile"
						}
					},
					"name": "meta.group.batchfile",
					"patterns": [
						{
							"match": ",|;",
							"name": "punctuation.separator.batchfile"
						},
						{
							"include": "$self"
						}
					]
				}
			]
		},
		"repeatParameter": {
			"patterns": [
				{
					"match": "(%%)(?:(?i:~[fdpnxsatz]*(?:\\$PATH:)?)?[a-zA-Z])",
					"captures": {
						"1": {
							"name": "punctuation.definition.variable.batchfile"
						}
					},
					"name": "variable.parameter.repeat.batchfile"
				}
			]
		},
		"strings": {
			"patterns": [
				{
					"begin": "\"",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.string.begin.batchfile"
						}
					},
					"end": "(\")|(\\n)",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.string.end.batchfile"
						},
						"2": {
							"name": "invalid.illegal.newline.batchfile"
						}
					},
					"name": "string.quoted.double.batchfile",
					"patterns": [
						{
							"match": "%%",
							"name": "constant.character.escape.batchfile"
						},
						{
							"include": "#variables"
						}
					]
				}
			]
		},
		"variables": {
			"patterns": [
				{
					"match": "(%)(?:(?i:~[fdpnxsatz]*(?:\\$PATH:)?)?\\d|\\*)",
					"captures": {
						"1": {
							"name": "punctuation.definition.variable.batchfile"
						}
					},
					"name": "variable.parameter.batchfile"
				},
				{
					"include": "#variable"
				},
				{
					"include": "#variable_delayed_expansion"
				}
			]
		},
		"variable": {
			"patterns": [
				{
					"begin": "%(?=[^%]+%)",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.variable.begin.batchfile"
						}
					},
					"end": "(%)|\\n",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.variable.end.batchfile"
						}
					},
					"name": "variable.other.readwrite.batchfile",
					"patterns": [
						{
							"begin": ":~",
							"beginCaptures": {
								"0": {
									"name": "punctuation.separator.batchfile"
								}
							},
							"end": "(?=%|\\n)",
							"name": "meta.variable.substring.batchfile",
							"patterns": [
								{
									"include": "#variable_substring"
								}
							]
						},
						{
							"begin": ":",
							"beginCaptures": {
								"0": {
									"name": "punctuation.separator.batchfile"
								}
							},
							"end": "(?=%|\\n)",
							"name": "meta.variable.substitution.batchfile",
							"patterns": [
								{
									"include": "#variable_replace"
								},
								{
									"begin": "=",
									"beginCaptures": {
										"0": {
											"name": "punctuation.separator.batchfile"
										}
									},
									"end": "(?=%|\\n)",
									"patterns": [
										{
											"include": "#variable_delayed_expansion"
										},
										{
											"match": "[^%]+",
											"name": "string.unquoted.batchfile"
										}
									]
								}
							]
						}
					]
				}
			]
		},
		"variable_delayed_expansion": {
			"patterns": [
				{
					"begin": "!(?=[^!]+!)",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.variable.begin.batchfile"
						}
					},
					"end": "(!)|\\n",
					"endCaptures": {
						"1": {
							"name": "punctuation.definition.variable.end.batchfile"
						}
					},
					"name": "variable.other.readwrite.batchfile",
					"patterns": [
						{
							"begin": ":~",
							"beginCaptures": {
								"0": {
									"name": "punctuation.separator.batchfile"
								}
							},
							"end": "(?=!|\\n)",
							"name": "meta.variable.substring.batchfile",
							"patterns": [
								{
									"include": "#variable_substring"
								}
							]
						},
						{
							"begin": ":",
							"beginCaptures": {
								"0": {
									"name": "punctuation.separator.batchfile"
								}
							},
							"end": "(?=!|\\n)",
							"name": "meta.variable.substitution.batchfile",
							"patterns": [
								{
									"include": "#escaped_characters"
								},
								{
									"include": "#variable_replace"
								},
								{
									"include": "#variable"
								},
								{
									"begin": "=",
									"beginCaptures": {
										"0": {
											"name": "punctuation.separator.batchfile"
										}
									},
									"end": "(?=!|\\n)",
									"patterns": [
										{
											"include": "#variable"
										},
										{
											"match": "[^!]+",
											"name": "string.unquoted.batchfile"
										}
									]
								}
							]
						}
					]
				}
			]
		},
		"variable_replace": {
			"patterns": [
				{
					"match": "[^=%!\\n]+",
					"name": "string.unquoted.batchfile"
				}
			]
		},
		"variable_substring": {
			"patterns": [
				{
					"match": "([+-]?\\d+)(?:(,)([+-]?\\d+))?",
					"captures": {
						"1": {
							"name": "constant.numeric.batchfile"
						},
						"2": {
							"name": "punctuation.separator.batchfile"
						},
						"3": {
							"name": "constant.numeric.batchfile"
						}
					}
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/clojure/.vscodeignore]---
Location: vscode-main/extensions/clojure/.vscodeignore

```text
test/**
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/clojure/cgmanifest.json]---
Location: vscode-main/extensions/clojure/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "atom/language-clojure",
					"repositoryUrl": "https://github.com/atom/language-clojure",
					"commitHash": "45bdb881501d0b8f8b707ca1d3fcc8b4b99fca03"
				}
			},
			"license": "MIT",
			"version": "0.22.8",
			"description": "The file syntaxes/clojure.tmLanguage.json was derived from the Atom package https://github.com/atom/language-clojure which was originally converted from the TextMate bundle https://github.com/mmcgrana/textmate-clojure."
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

````
