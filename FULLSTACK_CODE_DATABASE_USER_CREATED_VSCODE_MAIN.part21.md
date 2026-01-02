---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:25Z
part: 21
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 21 of 552)

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

---[FILE: cli/.cargo/config.toml]---
Location: vscode-main/cli/.cargo/config.toml

```toml
[target.'cfg(all(target_os = "windows", any(target_arch = "i686", target_arch = "x86_64", target_arch = "x86")))']
rustflags = ["-Ctarget-feature=+crt-static", "-Clink-args=/guard:cf", "-Clink-args=/CETCOMPAT"]

# CETCOMPAT is not supported on ARM binaries
[target.'cfg(all(target_os = "windows", not(any(target_arch = "i686", target_arch = "x86_64", target_arch = "x86"))))']
rustflags = ["-Ctarget-feature=+crt-static", "-Clink-args=/guard:cf"]
```

--------------------------------------------------------------------------------

---[FILE: cli/src/async_pipe.rs]---
Location: vscode-main/cli/src/async_pipe.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use crate::{constants::APPLICATION_NAME, util::errors::CodeError};
use async_trait::async_trait;
use std::path::{Path, PathBuf};
use std::pin::Pin;
use std::task::{Context, Poll};
use tokio::io::{AsyncRead, AsyncWrite};
use tokio::net::TcpListener;
use uuid::Uuid;

// todo: we could probably abstract this into some crate, if one doesn't already exist

cfg_if::cfg_if! {
	if #[cfg(unix)] {
		pub type AsyncPipe = tokio::net::UnixStream;
		pub type AsyncPipeWriteHalf = tokio::net::unix::OwnedWriteHalf;
		pub type AsyncPipeReadHalf = tokio::net::unix::OwnedReadHalf;

		pub async fn get_socket_rw_stream(path: &Path) -> Result<AsyncPipe, CodeError> {
			tokio::net::UnixStream::connect(path)
				.await
				.map_err(CodeError::AsyncPipeFailed)
		}

		pub async fn listen_socket_rw_stream(path: &Path) -> Result<AsyncPipeListener, CodeError> {
			tokio::net::UnixListener::bind(path)
				.map(AsyncPipeListener)
				.map_err(CodeError::AsyncPipeListenerFailed)
		}

		pub struct AsyncPipeListener(tokio::net::UnixListener);

		impl AsyncPipeListener {
			pub async fn accept(&mut self) -> Result<AsyncPipe, CodeError> {
				self.0.accept().await.map_err(CodeError::AsyncPipeListenerFailed).map(|(s, _)| s)
			}
		}

		pub fn socket_stream_split(pipe: AsyncPipe) -> (AsyncPipeReadHalf, AsyncPipeWriteHalf) {
			pipe.into_split()
		}
	} else {
		use tokio::{time::sleep, io::ReadBuf};
		use tokio::net::windows::named_pipe::{ClientOptions, ServerOptions, NamedPipeClient, NamedPipeServer};
		use std::{time::Duration, io};
		use pin_project::pin_project;

		#[pin_project(project = AsyncPipeProj)]
		pub enum AsyncPipe {
			PipeClient(#[pin] NamedPipeClient),
			PipeServer(#[pin] NamedPipeServer),
		}

		impl AsyncRead for AsyncPipe {
			fn poll_read(
				self: Pin<&mut Self>,
				cx: &mut Context<'_>,
				buf: &mut ReadBuf<'_>,
			) -> Poll<io::Result<()>> {
				match self.project() {
					AsyncPipeProj::PipeClient(c) => c.poll_read(cx, buf),
					AsyncPipeProj::PipeServer(c) => c.poll_read(cx, buf),
				}
			}
		}

		impl AsyncWrite for AsyncPipe {
			fn poll_write(
				self: Pin<&mut Self>,
				cx: &mut Context<'_>,
				buf: &[u8],
			) -> Poll<io::Result<usize>> {
				match self.project() {
					AsyncPipeProj::PipeClient(c) => c.poll_write(cx, buf),
					AsyncPipeProj::PipeServer(c) => c.poll_write(cx, buf),
				}
			}

			fn poll_write_vectored(
				self: Pin<&mut Self>,
				cx: &mut Context<'_>,
				bufs: &[io::IoSlice<'_>],
			) -> Poll<Result<usize, io::Error>> {
				match self.project() {
					AsyncPipeProj::PipeClient(c) => c.poll_write_vectored(cx, bufs),
					AsyncPipeProj::PipeServer(c) => c.poll_write_vectored(cx, bufs),
				}
			}

			fn poll_flush(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<io::Result<()>> {
				match self.project() {
					AsyncPipeProj::PipeClient(c) => c.poll_flush(cx),
					AsyncPipeProj::PipeServer(c) => c.poll_flush(cx),
				}
			}

			fn is_write_vectored(&self) -> bool {
				match self {
					AsyncPipe::PipeClient(c) => c.is_write_vectored(),
					AsyncPipe::PipeServer(c) => c.is_write_vectored(),
				}
			}

			fn poll_shutdown(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Result<(), io::Error>> {
				match self.project() {
					AsyncPipeProj::PipeClient(c) => c.poll_shutdown(cx),
					AsyncPipeProj::PipeServer(c) => c.poll_shutdown(cx),
				}
			}
		}

		pub type AsyncPipeWriteHalf = tokio::io::WriteHalf<AsyncPipe>;
		pub type AsyncPipeReadHalf = tokio::io::ReadHalf<AsyncPipe>;

		pub async fn get_socket_rw_stream(path: &Path) -> Result<AsyncPipe, CodeError> {
			// Tokio says we can need to try in a loop. Do so.
			// https://docs.rs/tokio/latest/tokio/net/windows/named_pipe/struct.NamedPipeClient.html
			let client = loop {
				match ClientOptions::new().open(path) {
					Ok(client) => break client,
					// ERROR_PIPE_BUSY https://docs.microsoft.com/en-us/windows/win32/debug/system-error-codes--0-499-
					Err(e) if e.raw_os_error() == Some(231) => sleep(Duration::from_millis(100)).await,
					Err(e) => return Err(CodeError::AsyncPipeFailed(e)),
				}
			};

			Ok(AsyncPipe::PipeClient(client))
		}

		pub struct AsyncPipeListener {
			path: PathBuf,
			server: NamedPipeServer
		}

		impl AsyncPipeListener {
			pub async fn accept(&mut self) -> Result<AsyncPipe, CodeError> {
				// see https://docs.rs/tokio/latest/tokio/net/windows/named_pipe/struct.NamedPipeServer.html
				// this is a bit weird in that the server becomes the client once
				// they get a connection, and we create a new client.

				self.server
					.connect()
					.await
					.map_err(CodeError::AsyncPipeListenerFailed)?;

				// Construct the next server to be connected before sending the one
				// we already have of onto a task. This ensures that the server
				// isn't closed (after it's done in the task) before a new one is
				// available. Otherwise the client might error with
				// `io::ErrorKind::NotFound`.
				let next_server = ServerOptions::new()
					.create(&self.path)
					.map_err(CodeError::AsyncPipeListenerFailed)?;


				Ok(AsyncPipe::PipeServer(std::mem::replace(&mut self.server, next_server)))
			}
		}

		pub async fn listen_socket_rw_stream(path: &Path) -> Result<AsyncPipeListener, CodeError> {
			let server = ServerOptions::new()
					.first_pipe_instance(true)
					.create(path)
					.map_err(CodeError::AsyncPipeListenerFailed)?;

			Ok(AsyncPipeListener { path: path.to_owned(), server })
		}

		pub fn socket_stream_split(pipe: AsyncPipe) -> (AsyncPipeReadHalf, AsyncPipeWriteHalf) {
			tokio::io::split(pipe)
		}
	}
}

impl AsyncPipeListener {
	pub fn into_pollable(self) -> PollableAsyncListener {
		PollableAsyncListener {
			listener: Some(self),
			write_fut: tokio_util::sync::ReusableBoxFuture::new(make_accept_fut(None)),
		}
	}
}

pub struct PollableAsyncListener {
	listener: Option<AsyncPipeListener>,
	write_fut: tokio_util::sync::ReusableBoxFuture<
		'static,
		(AsyncPipeListener, Result<AsyncPipe, CodeError>),
	>,
}

async fn make_accept_fut(
	data: Option<AsyncPipeListener>,
) -> (AsyncPipeListener, Result<AsyncPipe, CodeError>) {
	match data {
		Some(mut l) => {
			let c = l.accept().await;
			(l, c)
		}
		None => unreachable!("this future should not be pollable in this state"),
	}
}

impl hyper::server::accept::Accept for PollableAsyncListener {
	type Conn = AsyncPipe;
	type Error = CodeError;

	fn poll_accept(
		mut self: Pin<&mut Self>,
		cx: &mut Context<'_>,
	) -> Poll<Option<Result<Self::Conn, Self::Error>>> {
		if let Some(l) = self.listener.take() {
			self.write_fut.set(make_accept_fut(Some(l)))
		}

		match self.write_fut.poll(cx) {
			Poll::Ready((l, cnx)) => {
				self.listener = Some(l);
				Poll::Ready(Some(cnx))
			}
			Poll::Pending => Poll::Pending,
		}
	}
}

/// Gets a random name for a pipe/socket on the platform
pub fn get_socket_name() -> PathBuf {
	cfg_if::cfg_if! {
		if #[cfg(unix)] {
			std::env::temp_dir().join(format!("{}-{}", APPLICATION_NAME, Uuid::new_v4()))
		} else {
			PathBuf::from(format!(r"\\.\pipe\{}-{}", APPLICATION_NAME, Uuid::new_v4()))
		}
	}
}

pub type AcceptedRW = (
	Box<dyn AsyncRead + Send + Unpin>,
	Box<dyn AsyncWrite + Send + Unpin>,
);

#[async_trait]
pub trait AsyncRWAccepter {
	async fn accept_rw(&mut self) -> Result<AcceptedRW, CodeError>;
}

#[async_trait]
impl AsyncRWAccepter for AsyncPipeListener {
	async fn accept_rw(&mut self) -> Result<AcceptedRW, CodeError> {
		let pipe = self.accept().await?;
		let (read, write) = socket_stream_split(pipe);
		Ok((Box::new(read), Box::new(write)))
	}
}

#[async_trait]
impl AsyncRWAccepter for TcpListener {
	async fn accept_rw(&mut self) -> Result<AcceptedRW, CodeError> {
		let (stream, _) = self
			.accept()
			.await
			.map_err(CodeError::AsyncPipeListenerFailed)?;
		let (read, write) = tokio::io::split(stream);
		Ok((Box::new(read), Box::new(write)))
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/auth.rs]---
Location: vscode-main/cli/src/auth.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use crate::{
	constants::{get_default_user_agent, APPLICATION_NAME, IS_INTERACTIVE_CLI, PRODUCT_NAME_LONG},
	debug, error, info, log,
	state::{LauncherPaths, PersistedState},
	trace,
	util::{
		errors::{
			wrap, AnyError, CodeError, OAuthError, RefreshTokenNotAvailableError, StatusError,
			WrappedError,
		},
		input::prompt_options,
	},
	warning,
};
use async_trait::async_trait;
use chrono::{DateTime, Utc};
use gethostname::gethostname;
use serde::{de::DeserializeOwned, Deserialize, Serialize};
use std::{cell::Cell, fmt::Display, path::PathBuf, sync::Arc, thread};
use tokio::time::sleep;
use tunnels::{
	contracts::PROD_FIRST_PARTY_APP_ID,
	management::{Authorization, AuthorizationProvider, HttpError},
};

#[derive(Deserialize)]
struct DeviceCodeResponse {
	device_code: String,
	user_code: String,
	message: Option<String>,
	verification_uri: String,
	expires_in: i64,
}

#[derive(Deserialize, Debug)]
struct AuthenticationResponse {
	access_token: String,
	refresh_token: Option<String>,
	expires_in: Option<i64>,
}

#[derive(Deserialize)]
struct AuthenticationError {
	error: String,
	error_description: Option<String>,
}

#[derive(clap::ValueEnum, Serialize, Deserialize, Debug, Clone, Copy)]
pub enum AuthProvider {
	Microsoft,
	Github,
}

impl Display for AuthProvider {
	fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
		match self {
			AuthProvider::Microsoft => write!(f, "Microsoft Account"),
			AuthProvider::Github => write!(f, "GitHub Account"),
		}
	}
}

impl AuthProvider {
	pub fn client_id(&self) -> &'static str {
		match self {
			AuthProvider::Microsoft => "aebc6443-996d-45c2-90f0-388ff96faa56",
			AuthProvider::Github => "01ab8ac9400c4e429b23",
		}
	}

	pub fn code_uri(&self) -> &'static str {
		match self {
			AuthProvider::Microsoft => {
				"https://login.microsoftonline.com/organizations/oauth2/v2.0/devicecode"
			}
			AuthProvider::Github => "https://github.com/login/device/code",
		}
	}

	pub fn grant_uri(&self) -> &'static str {
		match self {
			AuthProvider::Microsoft => {
				"https://login.microsoftonline.com/organizations/oauth2/v2.0/token"
			}
			AuthProvider::Github => "https://github.com/login/oauth/access_token",
		}
	}

	pub fn get_default_scopes(&self) -> String {
		match self {
			AuthProvider::Microsoft => {
				format!("{PROD_FIRST_PARTY_APP_ID}/.default+offline_access+profile+openid")
			}
			AuthProvider::Github => "read:user+read:org".to_string(),
		}
	}
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct StoredCredential {
	#[serde(rename = "p")]
	pub(crate) provider: AuthProvider,
	#[serde(rename = "a")]
	access_token: String,
	#[serde(rename = "r")]
	refresh_token: Option<String>,
	#[serde(rename = "e")]
	expires_at: Option<DateTime<Utc>>,
}

const GH_USER_ENDPOINT: &str = "https://api.github.com/user";

async fn get_github_user(
	client: &reqwest::Client,
	access_token: &str,
) -> Result<reqwest::Response, reqwest::Error> {
	client
		.get(GH_USER_ENDPOINT)
		.header("Authorization", format!("token {access_token}"))
		.header("User-Agent", get_default_user_agent())
		.send()
		.await
}

impl StoredCredential {
	pub async fn is_expired(&self, log: &log::Logger, client: &reqwest::Client) -> bool {
		match self.provider {
			AuthProvider::Microsoft => self
				.expires_at
				.map(|e| Utc::now() + chrono::Duration::minutes(5) > e)
				.unwrap_or(false),

			// Make an auth request to Github. Mark the credential as expired
			// only on a verifiable 4xx code. We don't error on any failed
			// request since then a drop in connection could "require" a refresh
			AuthProvider::Github => {
				let res = get_github_user(client, &self.access_token).await;
				let res = match res {
					Ok(r) => r,
					Err(e) => {
						warning!(log, "failed to check GitHub token: {}", e);
						return false;
					}
				};

				if res.status().is_success() {
					return false;
				}

				let err = StatusError::from_res(res).await;
				debug!(log, "GitHub token looks expired: {:?}", err);
				true
			}
		}
	}

	fn from_response(auth: AuthenticationResponse, provider: AuthProvider) -> Self {
		StoredCredential {
			provider,
			access_token: auth.access_token,
			refresh_token: auth.refresh_token,
			expires_at: auth
				.expires_in
				.map(|e| Utc::now() + chrono::Duration::seconds(e)),
		}
	}
}

struct StorageWithLastRead {
	storage: Box<dyn StorageImplementation>,
	fallback_storage: Option<FileStorage>,
	last_read: Cell<Result<Option<StoredCredential>, WrappedError>>,
}

#[derive(Clone)]
pub struct Auth {
	client: reqwest::Client,
	log: log::Logger,
	file_storage_path: PathBuf,
	storage: Arc<std::sync::Mutex<Option<StorageWithLastRead>>>,
}

trait StorageImplementation: Send + Sync {
	fn read(&mut self) -> Result<Option<StoredCredential>, AnyError>;
	fn store(&mut self, value: StoredCredential) -> Result<(), AnyError>;
	fn clear(&mut self) -> Result<(), AnyError>;
}

// unseal decrypts and deserializes the value
fn seal<T>(value: &T) -> String
where
	T: Serialize + ?Sized,
{
	let dec = serde_json::to_string(value).expect("expected to serialize");
	if std::env::var("VSCODE_CLI_DISABLE_KEYCHAIN_ENCRYPT").is_ok() {
		return dec;
	}
	encrypt(&dec)
}

// unseal decrypts and deserializes the value
fn unseal<T>(value: &str) -> Option<T>
where
	T: DeserializeOwned,
{
	// small back-compat for old unencrypted values, or if VSCODE_CLI_DISABLE_KEYCHAIN_ENCRYPT set
	if let Ok(v) = serde_json::from_str::<T>(value) {
		return Some(v);
	}

	let dec = decrypt(value)?;
	serde_json::from_str::<T>(&dec).ok()
}

#[cfg(target_os = "windows")]
const KEYCHAIN_ENTRY_LIMIT: usize = 1024;
#[cfg(not(target_os = "windows"))]
const KEYCHAIN_ENTRY_LIMIT: usize = 128 * 1024;

const CONTINUE_MARKER: &str = "<MORE>";

/// Implementation that wraps the KeyringStorage on Linux to avoid
/// https://github.com/hwchen/keyring-rs/issues/132
struct ThreadKeyringStorage {
	s: Option<KeyringStorage>,
}

impl ThreadKeyringStorage {
	fn thread_op<R, Fn>(&mut self, f: Fn) -> Result<R, AnyError>
	where
		Fn: 'static + Send + FnOnce(&mut KeyringStorage) -> Result<R, AnyError>,
		R: 'static + Send,
	{
		let mut s = match self.s.take() {
			Some(s) => s,
			None => return Err(CodeError::KeyringTimeout.into()),
		};

		// It seems like on Linux communication to the keyring can block indefinitely.
		// Fall back after a 5 second timeout.
		let (sender, receiver) = std::sync::mpsc::channel();
		let tsender = sender.clone();

		thread::spawn(move || sender.send(Some((f(&mut s), s))));
		thread::spawn(move || {
			thread::sleep(std::time::Duration::from_secs(5));
			let _ = tsender.send(None);
		});

		match receiver.recv().unwrap() {
			Some((r, s)) => {
				self.s = Some(s);
				r
			}
			None => Err(CodeError::KeyringTimeout.into()),
		}
	}
}

impl Default for ThreadKeyringStorage {
	fn default() -> Self {
		Self {
			s: Some(KeyringStorage::default()),
		}
	}
}

impl StorageImplementation for ThreadKeyringStorage {
	fn read(&mut self) -> Result<Option<StoredCredential>, AnyError> {
		self.thread_op(|s| s.read())
	}

	fn store(&mut self, value: StoredCredential) -> Result<(), AnyError> {
		self.thread_op(move |s| s.store(value))
	}

	fn clear(&mut self) -> Result<(), AnyError> {
		self.thread_op(|s| s.clear())
	}
}

#[derive(Default)]
struct KeyringStorage {
	// keyring storage can be split into multiple entries due to entry length limits
	// on Windows https://github.com/microsoft/vscode-cli/issues/358
	entries: Vec<keyring::Entry>,
}

macro_rules! get_next_entry {
	($self: expr, $i: expr) => {
		match $self.entries.get($i) {
			Some(e) => e,
			None => {
				let e = keyring::Entry::new("vscode-cli", &format!("vscode-cli-{}", $i)).unwrap();
				$self.entries.push(e);
				$self.entries.last().unwrap()
			}
		}
	};
}

impl StorageImplementation for KeyringStorage {
	fn read(&mut self) -> Result<Option<StoredCredential>, AnyError> {
		let mut str = String::new();

		for i in 0.. {
			let entry = get_next_entry!(self, i);
			let next_chunk = match entry.get_password() {
				Ok(value) => value,
				Err(keyring::Error::NoEntry) => return Ok(None), // missing entries?
				Err(e) => return Err(wrap(e, "error reading keyring").into()),
			};

			if next_chunk.ends_with(CONTINUE_MARKER) {
				str.push_str(&next_chunk[..next_chunk.len() - CONTINUE_MARKER.len()]);
			} else {
				str.push_str(&next_chunk);
				break;
			}
		}

		Ok(unseal(&str))
	}

	fn store(&mut self, value: StoredCredential) -> Result<(), AnyError> {
		let sealed = seal(&value);
		let step_size = KEYCHAIN_ENTRY_LIMIT - CONTINUE_MARKER.len();

		for i in (0..sealed.len()).step_by(step_size) {
			let entry = get_next_entry!(self, i / step_size);

			let cutoff = i + step_size;
			let stored = if cutoff <= sealed.len() {
				let mut part = sealed[i..cutoff].to_string();
				part.push_str(CONTINUE_MARKER);
				entry.set_password(&part)
			} else {
				entry.set_password(&sealed[i..])
			};

			if let Err(e) = stored {
				return Err(wrap(e, "error updating keyring").into());
			}
		}

		Ok(())
	}

	fn clear(&mut self) -> Result<(), AnyError> {
		self.read().ok(); // make sure component parts are available
		for entry in self.entries.iter() {
			entry
				.delete_password()
				.map_err(|e| wrap(e, "error updating keyring"))?;
		}
		self.entries.clear();

		Ok(())
	}
}

struct FileStorage(PersistedState<Option<String>>);

impl StorageImplementation for FileStorage {
	fn read(&mut self) -> Result<Option<StoredCredential>, AnyError> {
		Ok(self.0.load().and_then(|s| unseal(&s)))
	}

	fn store(&mut self, value: StoredCredential) -> Result<(), AnyError> {
		self.0.save(Some(seal(&value))).map_err(|e| e.into())
	}

	fn clear(&mut self) -> Result<(), AnyError> {
		self.0.save(None).map_err(|e| e.into())
	}
}

impl Auth {
	pub fn new(paths: &LauncherPaths, log: log::Logger) -> Auth {
		Auth {
			log,
			client: reqwest::Client::new(),
			file_storage_path: paths.root().join("token.json"),
			storage: Arc::new(std::sync::Mutex::new(None)),
		}
	}

	fn with_storage<T, F>(&self, op: F) -> T
	where
		F: FnOnce(&mut StorageWithLastRead) -> T,
	{
		let mut opt = self.storage.lock().unwrap();
		if let Some(s) = opt.as_mut() {
			return op(s);
		}

		#[cfg(not(target_os = "linux"))]
		let mut keyring_storage = KeyringStorage::default();
		#[cfg(target_os = "linux")]
		let mut keyring_storage = ThreadKeyringStorage::default();
		let mut file_storage = FileStorage(PersistedState::new_with_mode(
			self.file_storage_path.clone(),
			0o600,
		));

		let native_storage_result = if std::env::var("VSCODE_CLI_USE_FILE_KEYCHAIN").is_ok()
			|| self.file_storage_path.exists()
		{
			Err(wrap("", "user prefers file storage").into())
		} else {
			keyring_storage.read()
		};

		let mut storage = match native_storage_result {
			Ok(v) => StorageWithLastRead {
				last_read: Cell::new(Ok(v)),
				fallback_storage: Some(file_storage),
				storage: Box::new(keyring_storage),
			},
			Err(e) => {
				debug!(self.log, "Using file keychain storage due to: {}", e);
				StorageWithLastRead {
					last_read: Cell::new(
						file_storage
							.read()
							.map_err(|e| wrap(e, "could not read from file storage")),
					),
					fallback_storage: None,
					storage: Box::new(file_storage),
				}
			}
		};

		let out = op(&mut storage);
		*opt = Some(storage);
		out
	}

	/// Gets a tunnel Authentication for use in the tunnel management API.
	pub async fn get_tunnel_authentication(&self) -> Result<Authorization, AnyError> {
		let cred = self.get_credential().await?;
		let auth = match cred.provider {
			AuthProvider::Microsoft => Authorization::Bearer(cred.access_token),
			AuthProvider::Github => Authorization::Github(format!(
				"client_id={} {}",
				cred.provider.client_id(),
				cred.access_token
			)),
		};

		Ok(auth)
	}

	/// Reads the current details from the keyring.
	pub fn get_current_credential(&self) -> Result<Option<StoredCredential>, WrappedError> {
		self.with_storage(|storage| {
			let value = storage.last_read.replace(Ok(None));
			storage.last_read.set(value.clone());
			value
		})
	}

	/// Clears login info from the keyring.
	pub fn clear_credentials(&self) -> Result<(), AnyError> {
		self.with_storage(|storage| {
			storage.storage.clear()?;
			storage.last_read.set(Ok(None));
			Ok(())
		})
	}

	/// Runs the login flow, optionally pre-filling a provider and/or access token.
	pub async fn login(
		&self,
		provider: Option<AuthProvider>,
		access_token: Option<String>,
		refresh_token: Option<String>,
	) -> Result<StoredCredential, AnyError> {
		let provider = match provider {
			Some(p) => p,
			None => self.prompt_for_provider().await?,
		};

		let credentials = match access_token {
			Some(t) => StoredCredential {
				provider,
				access_token: t,
				// if a refresh token is given, assume it's valid now but refresh it
				// soon in order to get the real expiry time.
				expires_at: refresh_token
					.as_ref()
					.map(|_| Utc::now() + chrono::Duration::minutes(5)),
				refresh_token,
			},
			None => self.do_device_code_flow_with_provider(provider).await?,
		};

		self.store_credentials(credentials.clone());
		Ok(credentials)
	}

	/// Gets the currently stored credentials, or asks the user to log in.
	pub async fn get_credential(&self) -> Result<StoredCredential, AnyError> {
		let entry = match self.get_current_credential() {
			Ok(Some(old_creds)) => {
				trace!(self.log, "Found token in keyring");
				match self.maybe_refresh_token(&old_creds).await {
					Ok(Some(new_creds)) => {
						self.store_credentials(new_creds.clone());
						new_creds
					}
					Ok(None) => old_creds,
					Err(e) => {
						info!(self.log, "error refreshing token: {}", e);
						let new_creds = self
							.do_device_code_flow_with_provider(old_creds.provider)
							.await?;
						self.store_credentials(new_creds.clone());
						new_creds
					}
				}
			}

			Ok(None) => {
				trace!(self.log, "No token in keyring, getting a new one");
				let creds = self.do_device_code_flow().await?;
				self.store_credentials(creds.clone());
				creds
			}

			Err(e) => {
				warning!(
					self.log,
					"Error reading token from keyring, getting a new one: {}",
					e
				);
				let creds = self.do_device_code_flow().await?;
				self.store_credentials(creds.clone());
				creds
			}
		};

		Ok(entry)
	}

	/// Stores credentials, logging a warning if it fails.
	fn store_credentials(&self, creds: StoredCredential) {
		self.with_storage(|storage| {
			if let Err(e) = storage.storage.store(creds.clone()) {
				warning!(
					self.log,
					"Failed to update keyring with new credentials: {}",
					e
				);

				if let Some(fb) = storage.fallback_storage.take() {
					storage.storage = Box::new(fb);
					match storage.storage.store(creds.clone()) {
						Err(e) => {
							warning!(self.log, "Also failed to update fallback storage: {}", e)
						}
						Ok(_) => debug!(self.log, "Updated fallback storage successfully"),
					}
				}
			}

			storage.last_read.set(Ok(Some(creds)));
		})
	}

	/// Refreshes the token in the credentials if necessary. Returns None if
	/// the token is up to date, or Some new token otherwise.
	async fn maybe_refresh_token(
		&self,
		creds: &StoredCredential,
	) -> Result<Option<StoredCredential>, AnyError> {
		if !creds.is_expired(&self.log, &self.client).await {
			return Ok(None);
		}

		self.do_refresh_token(creds).await
	}

	/// Refreshes the token in the credentials. Returns an error if the process failed.
	/// Returns None if the token didn't change.
	async fn do_refresh_token(
		&self,
		creds: &StoredCredential,
	) -> Result<Option<StoredCredential>, AnyError> {
		match &creds.refresh_token {
			Some(t) => self
				.do_grant(
					creds.provider,
					format!(
						"client_id={}&grant_type=refresh_token&refresh_token={}",
						creds.provider.client_id(),
						t
					),
				)
				.await
				.map(Some),
			None => match creds.provider {
				AuthProvider::Github => self.touch_github_token(creds).await.map(|_| None),
				_ => Err(RefreshTokenNotAvailableError().into()),
			},
		}
	}

	/// Does a "grant token" request.
	async fn do_grant(
		&self,
		provider: AuthProvider,
		body: String,
	) -> Result<StoredCredential, AnyError> {
		let response = self
			.client
			.post(provider.grant_uri())
			.body(body)
			.header("Accept", "application/json")
			.send()
			.await?;

		let status_code = response.status().as_u16();
		let body = response.bytes().await?;
		if let Ok(body) = serde_json::from_slice::<AuthenticationResponse>(&body) {
			return Ok(StoredCredential::from_response(body, provider));
		}

		Err(Auth::handle_grant_error(
			provider.grant_uri(),
			status_code,
			body,
		))
	}

	/// GH doesn't have a refresh token, but does limit to the 10 most recently
	/// used tokens per user (#9052), so for the github "refresh" just request
	/// the current user.
	async fn touch_github_token(&self, credential: &StoredCredential) -> Result<(), AnyError> {
		let response = get_github_user(&self.client, &credential.access_token).await?;
		if response.status().is_success() {
			return Ok(());
		}

		let status_code = response.status().as_u16();
		let body = response.bytes().await?;
		Err(Auth::handle_grant_error(
			GH_USER_ENDPOINT,
			status_code,
			body,
		))
	}

	fn handle_grant_error(url: &str, status_code: u16, body: bytes::Bytes) -> AnyError {
		if let Ok(res) = serde_json::from_slice::<AuthenticationError>(&body) {
			return OAuthError {
				error: res.error,
				error_description: res.error_description,
			}
			.into();
		}

		StatusError {
			body: String::from_utf8_lossy(&body).to_string(),
			status_code,
			url: url.to_string(),
		}
		.into()
	}
	/// Implements the device code flow, returning the credentials upon success.
	async fn do_device_code_flow(&self) -> Result<StoredCredential, AnyError> {
		let provider = self.prompt_for_provider().await?;
		self.do_device_code_flow_with_provider(provider).await
	}

	async fn prompt_for_provider(&self) -> Result<AuthProvider, AnyError> {
		if !*IS_INTERACTIVE_CLI {
			info!(
				self.log,
				"Using GitHub for authentication, run `{} tunnel user login --provider <provider>` option to change this.",
				APPLICATION_NAME
			);
			return Ok(AuthProvider::Github);
		}

		let provider = prompt_options(
			format!("How would you like to log in to {PRODUCT_NAME_LONG}?"),
			&[AuthProvider::Microsoft, AuthProvider::Github],
		)?;

		Ok(provider)
	}

	async fn do_device_code_flow_with_provider(
		&self,
		provider: AuthProvider,
	) -> Result<StoredCredential, AnyError> {
		loop {
			let init_code = self
				.client
				.post(provider.code_uri())
				.header("Accept", "application/json")
				.body(format!(
					"client_id={}&scope={}",
					provider.client_id(),
					provider.get_default_scopes(),
				))
				.send()
				.await?;

			if !init_code.status().is_success() {
				return Err(StatusError::from_res(init_code).await?.into());
			}

			let init_code_json = init_code.json::<DeviceCodeResponse>().await?;
			let expires_at = Utc::now() + chrono::Duration::seconds(init_code_json.expires_in);

			match &init_code_json.message {
				Some(m) => self.log.result(m),
				None => self.log.result(format!(
					"To grant access to the server, please log into {} and use code {}",
					init_code_json.verification_uri, init_code_json.user_code
				)),
			};

			let body = format!(
					"client_id={}&grant_type=urn:ietf:params:oauth:grant-type:device_code&device_code={}",
					provider.client_id(),
					init_code_json.device_code
			);

			let mut interval_s = 5;
			while Utc::now() < expires_at {
				sleep(std::time::Duration::from_secs(interval_s)).await;

				match self.do_grant(provider, body.clone()).await {
					Ok(creds) => return Ok(creds),
					Err(AnyError::OAuthError(e)) if e.error == "slow_down" => {
						interval_s += 5; // https://www.rfc-editor.org/rfc/rfc8628#section-3.5
						trace!(self.log, "refresh poll failed, slowing down");
					}
					// Github returns a non-standard 429 to slow down
					Err(AnyError::StatusError(e)) if e.status_code == 429 => {
						interval_s += 5; // https://www.rfc-editor.org/rfc/rfc8628#section-3.5
						trace!(self.log, "refresh poll failed, slowing down");
					}
					Err(e) => {
						trace!(self.log, "refresh poll failed, retrying: {}", e);
					}
				}
			}
		}
	}

	/// Maintains the stored credential by refreshing it against the service
	/// to ensure its stays current. Returns a future that should be polled and
	/// only errors if a refresh fails in a consistent way.
	pub async fn keep_token_alive(self) -> Result<(), AnyError> {
		let this = self.clone();
		let default_refresh = std::time::Duration::from_secs(60 * 60);
		let min_refresh = std::time::Duration::from_secs(10);

		let mut credential = this.get_credential().await?;
		let mut last_did_error = false;
		loop {
			let sleep_time = if last_did_error {
				min_refresh
			} else {
				match credential.expires_at {
					Some(d) => ((d - Utc::now()) * 2 / 3).to_std().unwrap_or(min_refresh),
					None => default_refresh,
				}
			};

			// to_std errors on negative duration, fall back to a 60s refresh
			tokio::time::sleep(sleep_time.max(min_refresh)).await;

			match this.do_refresh_token(&credential).await {
				// 4xx error means this token is probably not good any mode
				Err(AnyError::StatusError(e)) if e.status_code >= 400 && e.status_code < 500 => {
					error!(this.log, "failed to keep token alive: {:?}", e);
					return Err(e.into());
				}
				Err(AnyError::RefreshTokenNotAvailableError(_)) => {
					return Ok(());
				}
				Err(e) => {
					warning!(this.log, "error refreshing token: {:?}", e);
					last_did_error = true;
					continue;
				}
				Ok(c) => {
					trace!(this.log, "token was successfully refreshed in keepalive");
					last_did_error = false;
					if let Some(c) = c {
						this.store_credentials(c.clone());
						credential = c;
					}
				}
			}
		}
	}
}

#[async_trait]
impl AuthorizationProvider for Auth {
	async fn get_authorization(&self) -> Result<Authorization, HttpError> {
		self.get_tunnel_authentication()
			.await
			.map_err(|e| HttpError::AuthorizationError(e.to_string()))
	}
}

lazy_static::lazy_static! {
	static ref HOSTNAME: Vec<u8> = gethostname().to_string_lossy().bytes().collect();
}

#[cfg(feature = "vscode-encrypt")]
fn encrypt(value: &str) -> String {
	vscode_encrypt::encrypt(&HOSTNAME, value.as_bytes()).expect("expected to encrypt")
}

#[cfg(feature = "vscode-encrypt")]
fn decrypt(value: &str) -> Option<String> {
	let b = vscode_encrypt::decrypt(&HOSTNAME, value).ok()?;
	String::from_utf8(b).ok()
}

#[cfg(not(feature = "vscode-encrypt"))]
fn encrypt(value: &str) -> String {
	value.to_owned()
}

#[cfg(not(feature = "vscode-encrypt"))]
fn decrypt(value: &str) -> Option<String> {
	Some(value.to_owned())
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/commands.rs]---
Location: vscode-main/cli/src/commands.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

mod context;

pub mod args;
pub mod serve_web;
pub mod tunnels;
pub mod update;
pub mod version;
pub use context::CommandContext;
```

--------------------------------------------------------------------------------

---[FILE: cli/src/constants.rs]---
Location: vscode-main/cli/src/constants.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use serde::Deserialize;
use std::{collections::HashMap, io::IsTerminal};

use const_format::concatcp;
use lazy_static::lazy_static;

use crate::options::Quality;

pub const CONTROL_PORT: u16 = 31545;

/// Protocol version sent to clients. This can be used to indicate new or
/// changed capabilities that clients may wish to leverage.
///  1 - Initial protocol version
///  2 - Addition of `serve.compressed` property to control whether servermsg's
///      are compressed bidirectionally.
///  3 - The server's connection token is set to a SHA256 hash of the tunnel ID
///  4 - The server's msgpack messages are no longer length-prefixed
pub const PROTOCOL_VERSION: u32 = 4;

/// Prefix for the tunnel tag that includes the version.
pub const PROTOCOL_VERSION_TAG_PREFIX: &str = "protocolv";
/// Tag for the current protocol version, which is included in dev tunnels.
pub const PROTOCOL_VERSION_TAG: &str = concatcp!("protocolv", PROTOCOL_VERSION);

pub const VSCODE_CLI_VERSION: Option<&'static str> = option_env!("VSCODE_CLI_VERSION");
pub const VSCODE_CLI_AI_KEY: Option<&'static str> = option_env!("VSCODE_CLI_AI_KEY");
pub const VSCODE_CLI_AI_ENDPOINT: Option<&'static str> = option_env!("VSCODE_CLI_AI_ENDPOINT");
pub const VSCODE_CLI_QUALITY: Option<&'static str> = option_env!("VSCODE_CLI_QUALITY");
pub const DOCUMENTATION_URL: Option<&'static str> = option_env!("VSCODE_CLI_DOCUMENTATION_URL");
pub const VSCODE_CLI_COMMIT: Option<&'static str> = option_env!("VSCODE_CLI_COMMIT");
pub const VSCODE_CLI_UPDATE_ENDPOINT: Option<&'static str> = option_env!("VSCODE_CLI_UPDATE_URL");

/// Windows lock name for the running tunnel service. Used by the setup script
/// to detect a tunnel process. See #179265.
pub const TUNNEL_SERVICE_LOCK_NAME: Option<&'static str> =
	option_env!("VSCODE_CLI_WIN32_TUNNEL_SERVICE_MUTEX");

/// Windows lock name for the running tunnel without a service. Used by the setup
/// script to detect a tunnel process. See #179265.
pub const TUNNEL_CLI_LOCK_NAME: Option<&'static str> = option_env!("VSCODE_CLI_WIN32_TUNNEL_MUTEX");

pub const TUNNEL_SERVICE_USER_AGENT_ENV_VAR: &str = "TUNNEL_SERVICE_USER_AGENT";

/// Application name as it appears on the CLI.
pub const APPLICATION_NAME: &str = match option_env!("VSCODE_CLI_APPLICATION_NAME") {
	Some(n) => n,
	None => "code",
};

/// Full name of the product with its version.
pub const PRODUCT_NAME_LONG: &str = match option_env!("VSCODE_CLI_NAME_LONG") {
	Some(n) => n,
	None => "Code - OSS",
};

/// Name of the application without quality information.
pub const QUALITYLESS_PRODUCT_NAME: &str = match option_env!("VSCODE_CLI_QUALITYLESS_PRODUCT_NAME")
{
	Some(n) => n,
	None => "Code",
};

/// Name of the application without quality information.
pub const QUALITYLESS_SERVER_NAME: &str = concatcp!(QUALITYLESS_PRODUCT_NAME, " Server");

pub const QUALITY: &str = match VSCODE_CLI_QUALITY {
	Some(q) => q,
	_ => "oss",
};

/// Web URL the editor is hosted at. For VS Code, this is vscode.dev.
pub const EDITOR_WEB_URL: Option<&'static str> = option_env!("VSCODE_CLI_TUNNEL_EDITOR_WEB_URL");

/// Name shown in places where we need to tell a user what a process is, e.g. in sleep inhibition.
pub const TUNNEL_ACTIVITY_NAME: &str = concatcp!(PRODUCT_NAME_LONG, " Tunnel");

/// Download URL of the desktop product.
pub const PRODUCT_DOWNLOAD_URL: Option<&'static str> = option_env!("VSCODE_CLI_DOWNLOAD_URL");

const NONINTERACTIVE_VAR: &str = "VSCODE_CLI_NONINTERACTIVE";

/// Default data CLI data directory.
pub const DEFAULT_DATA_PARENT_DIR: &str = match option_env!("VSCODE_CLI_DATA_FOLDER_NAME") {
	Some(n) => n,
	None => ".vscode-oss",
};

pub fn get_default_user_agent() -> String {
	format!(
		"vscode-server-launcher/{}",
		VSCODE_CLI_VERSION.unwrap_or("dev")
	)
}

const NO_COLOR_ENV: &str = "NO_COLOR";

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ServerQualityInfo {
	pub server_application_name: String,
}

lazy_static! {
	pub static ref TUNNEL_SERVICE_USER_AGENT: String =
		match std::env::var(TUNNEL_SERVICE_USER_AGENT_ENV_VAR) {
			Ok(ua) if !ua.is_empty() => format!("{} {}", ua, get_default_user_agent()),
			_ => get_default_user_agent(),
		};

	/// Map of qualities to the server name
	pub static ref SERVER_NAME_MAP: Option<HashMap<Quality, ServerQualityInfo>> =
		option_env!("VSCODE_CLI_TUNNEL_SERVER_QUALITIES").and_then(|s| serde_json::from_str(s).unwrap());

	/// Whether i/o interactions are allowed in the current CLI.
	pub static ref IS_A_TTY: bool = std::io::stdin().is_terminal();

	/// Whether i/o interactions are allowed in the current CLI.
	pub static ref COLORS_ENABLED: bool = *IS_A_TTY && std::env::var(NO_COLOR_ENV).is_err();

	/// Whether i/o interactions are allowed in the current CLI.
	pub static ref IS_INTERACTIVE_CLI: bool = *IS_A_TTY && std::env::var(NONINTERACTIVE_VAR).is_err();

	/// Map of quality names to arrays of app IDs used for them, for example, `{"stable":["ABC123"]}`
	pub static ref WIN32_APP_IDS: Option<Vec<String>> =
		option_env!("VSCODE_CLI_WIN32_APP_IDS").map(|s| s.split(',').map(|s| s.to_string()).collect());
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/desktop.rs]---
Location: vscode-main/cli/src/desktop.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

mod version_manager;

pub use version_manager::{prompt_to_install, CodeVersionManager, RequestedVersion};
```

--------------------------------------------------------------------------------

---[FILE: cli/src/download_cache.rs]---
Location: vscode-main/cli/src/download_cache.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use std::{
	fs::create_dir_all,
	path::{Path, PathBuf},
};

use futures::Future;
use tokio::fs::remove_dir_all;

use crate::{
	state::PersistedState,
	util::errors::{wrap, AnyError, WrappedError},
};

const KEEP_LRU: usize = 5;
const STAGING_SUFFIX: &str = ".staging";
const RENAME_ATTEMPTS: u32 = 20;
const RENAME_DELAY: std::time::Duration = std::time::Duration::from_millis(200);
const PERSISTED_STATE_FILE_NAME: &str = "lru.json";

#[derive(Clone)]
pub struct DownloadCache {
	path: PathBuf,
	state: PersistedState<Vec<String>>,
}

impl DownloadCache {
	pub fn new(path: PathBuf) -> DownloadCache {
		DownloadCache {
			state: PersistedState::new(path.join(PERSISTED_STATE_FILE_NAME)),
			path,
		}
	}

	/// Gets the value stored on the state
	pub fn get(&self) -> Vec<String> {
		self.state.load()
	}

	/// Gets the download cache path. Names of cache entries can be formed by
	/// joining them to the path.
	pub fn path(&self) -> &Path {
		&self.path
	}

	/// Gets whether a cache exists with the name already. Marks it as recently
	/// used if it does exist.
	pub fn exists(&self, name: &str) -> Option<PathBuf> {
		let p = self.path.join(name);
		if !p.exists() {
			return None;
		}

		let _ = self.touch(name.to_string());
		Some(p)
	}

	/// Removes the item from the cache, if it exists
	pub fn delete(&self, name: &str) -> Result<(), WrappedError> {
		let f = self.path.join(name);
		if f.exists() {
			std::fs::remove_dir_all(f).map_err(|e| wrap(e, "error removing cached folder"))?;
		}

		self.state.update(|l| {
			l.retain(|n| n != name);
		})
	}

	/// Calls the function to create the cached folder if it doesn't exist,
	/// returning the path where the folder is. Note that the path passed to
	/// the `do_create` method is a staging path and will not be the same as the
	/// final returned path.
	pub async fn create<F, T>(
		&self,
		name: impl AsRef<str>,
		do_create: F,
	) -> Result<PathBuf, AnyError>
	where
		F: FnOnce(PathBuf) -> T,
		T: Future<Output = Result<(), AnyError>> + Send,
	{
		let name = name.as_ref();
		let target_dir = self.path.join(name);
		if target_dir.exists() {
			return Ok(target_dir);
		}

		let temp_dir = self.path.join(format!("{name}{STAGING_SUFFIX}"));
		let _ = remove_dir_all(&temp_dir).await; // cleanup any existing

		create_dir_all(&temp_dir).map_err(|e| wrap(e, "error creating server directory"))?;
		do_create(temp_dir.clone()).await?;

		let _ = self.touch(name.to_string());
		// retry the rename, it seems on WoA sometimes it takes a second for the
		// directory to be 'unlocked' after doing file/process operations in it.
		for attempt_no in 0..=RENAME_ATTEMPTS {
			match std::fs::rename(&temp_dir, &target_dir) {
				Ok(_) => {
					break;
				}
				Err(e) if attempt_no == RENAME_ATTEMPTS => {
					return Err(wrap(e, "error renaming downloaded server").into())
				}
				Err(_) => {
					tokio::time::sleep(RENAME_DELAY).await;
				}
			}
		}

		Ok(target_dir)
	}

	fn touch(&self, name: String) -> Result<(), AnyError> {
		self.state.update(|l| {
			if let Some(index) = l.iter().position(|s| s == &name) {
				l.remove(index);
			}
			l.insert(0, name);

			if l.len() <= KEEP_LRU {
				return;
			}

			if let Some(f) = l.last() {
				let f = self.path.join(f);
				if !f.exists() || std::fs::remove_dir_all(f).is_ok() {
					l.pop();
				}
			}
		})?;

		Ok(())
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/json_rpc.rs]---
Location: vscode-main/cli/src/json_rpc.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use tokio::{
	io::{AsyncBufReadExt, AsyncRead, AsyncWrite, AsyncWriteExt, BufReader},
	pin,
	sync::mpsc,
};

use crate::{
	rpc::{self, MaybeSync, Serialization},
	util::{
		errors::InvalidRpcDataError,
		sync::{Barrier, Receivable},
	},
};
use std::io;

#[derive(Clone)]
pub struct JsonRpcSerializer {}

impl Serialization for JsonRpcSerializer {
	fn serialize(&self, value: impl serde::Serialize) -> Vec<u8> {
		let mut v = serde_json::to_vec(&value).unwrap();
		v.push(b'\n');
		v
	}

	fn deserialize<P: serde::de::DeserializeOwned>(
		&self,
		b: &[u8],
	) -> Result<P, crate::util::errors::AnyError> {
		serde_json::from_slice(b).map_err(|e| InvalidRpcDataError(e.to_string()).into())
	}
}

/// Creates a new RPC Builder that serializes to JSON.
#[allow(dead_code)]
pub fn new_json_rpc() -> rpc::RpcBuilder<JsonRpcSerializer> {
	rpc::RpcBuilder::new(JsonRpcSerializer {})
}

#[allow(dead_code)]
pub async fn start_json_rpc<C: Send + Sync + 'static, S: Clone>(
	dispatcher: rpc::RpcDispatcher<JsonRpcSerializer, C>,
	read: impl AsyncRead + Unpin,
	mut write: impl AsyncWrite + Unpin,
	mut msg_rx: impl Receivable<Vec<u8>>,
	mut shutdown_rx: Barrier<S>,
) -> io::Result<Option<S>> {
	let (write_tx, mut write_rx) = mpsc::channel::<Vec<u8>>(8);
	let mut read = BufReader::new(read);

	let mut read_buf = String::new();
	let shutdown_fut = shutdown_rx.wait();
	pin!(shutdown_fut);

	loop {
		tokio::select! {
			r = &mut shutdown_fut => return Ok(r.ok()),
			Some(w) = write_rx.recv() => {
				write.write_all(&w).await?;
			},
			Some(w) = msg_rx.recv_msg() => {
				write.write_all(&w).await?;
			},
			n = read.read_line(&mut read_buf) => {
				let r = match n {
					Ok(0) => return Ok(None),
					Ok(n) => dispatcher.dispatch(read_buf[..n].as_bytes()),
					Err(e) => return Err(e)
				};

				read_buf.truncate(0);

				match r {
					MaybeSync::Sync(Some(v)) => {
						write.write_all(&v).await?;
					},
					MaybeSync::Sync(None) => continue,
					MaybeSync::Future(fut) => {
						let write_tx = write_tx.clone();
						tokio::spawn(async move {
							if let Some(v) = fut.await {
								let _ = write_tx.send(v).await;
							}
						});
					},
					MaybeSync::Stream((dto, fut)) => {
						if let Some(dto) = dto {
							dispatcher.register_stream(write_tx.clone(), dto).await;
						}
						let write_tx = write_tx.clone();
						tokio::spawn(async move {
							if let Some(v) = fut.await {
								let _ = write_tx.send(v).await;
							}
						});
					}
				}
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/lib.rs]---
Location: vscode-main/cli/src/lib.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// todo: we should reduce the exported surface area over time as things are
// moved into a common CLI
pub mod auth;
pub mod constants;
#[macro_use]
pub mod log;
pub mod commands;
pub mod desktop;
pub mod options;
pub mod self_update;
pub mod state;
pub mod tunnels;
pub mod update_service;
pub mod util;

mod async_pipe;
mod download_cache;
mod json_rpc;
mod msgpack_rpc;
mod rpc;
mod singleton;
```

--------------------------------------------------------------------------------

---[FILE: cli/src/log.rs]---
Location: vscode-main/cli/src/log.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use chrono::Local;
use opentelemetry::{
	sdk::trace::{Tracer, TracerProvider},
	trace::{SpanBuilder, Tracer as TraitTracer, TracerProvider as TracerProviderTrait},
};
use serde::{Deserialize, Serialize};
use std::fmt;
use std::{
	io::Write,
	sync::atomic::{AtomicU32, Ordering},
};
use std::{path::Path, sync::Arc};

use crate::constants::COLORS_ENABLED;

static INSTANCE_COUNTER: AtomicU32 = AtomicU32::new(0);

// Gets a next incrementing number that can be used in logs
pub fn next_counter() -> u32 {
	INSTANCE_COUNTER.fetch_add(1, Ordering::SeqCst)
}

// Log level
#[derive(
	clap::ValueEnum, PartialEq, Eq, PartialOrd, Clone, Copy, Debug, Serialize, Deserialize, Default,
)]
pub enum Level {
	Trace = 0,
	Debug,
	#[default]
	Info,
	Warn,
	Error,
	Critical,
	Off,
}

impl fmt::Display for Level {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		match self {
			Level::Critical => write!(f, "critical"),
			Level::Debug => write!(f, "debug"),
			Level::Error => write!(f, "error"),
			Level::Info => write!(f, "info"),
			Level::Off => write!(f, "off"),
			Level::Trace => write!(f, "trace"),
			Level::Warn => write!(f, "warn"),
		}
	}
}

impl Level {
	pub fn name(&self) -> Option<&str> {
		match self {
			Level::Trace => Some("trace"),
			Level::Debug => Some("debug"),
			Level::Info => Some("info"),
			Level::Warn => Some("warn"),
			Level::Error => Some("error"),
			Level::Critical => Some("critical"),
			Level::Off => None,
		}
	}

	pub fn color_code(&self) -> Option<&str> {
		if !*COLORS_ENABLED {
			return None;
		}

		match self {
			Level::Trace => None,
			Level::Debug => Some("\x1b[36m"),
			Level::Info => Some("\x1b[35m"),
			Level::Warn => Some("\x1b[33m"),
			Level::Error => Some("\x1b[31m"),
			Level::Critical => Some("\x1b[31m"),
			Level::Off => None,
		}
	}

	pub fn to_u8(self) -> u8 {
		self as u8
	}
}

pub fn new_tunnel_prefix() -> String {
	format!("[tunnel.{}]", next_counter())
}

pub fn new_code_server_prefix() -> String {
	format!("[codeserver.{}]", next_counter())
}

pub fn new_rpc_prefix() -> String {
	format!("[rpc.{}]", next_counter())
}

// Base logger implementation
#[derive(Clone)]
pub struct Logger {
	tracer: Arc<Tracer>,
	sink: Vec<Box<dyn LogSink>>,
	prefix: Option<String>,
}

// Copy trick from https://stackoverflow.com/a/30353928
pub trait LogSinkClone {
	fn clone_box(&self) -> Box<dyn LogSink>;
}

impl<T> LogSinkClone for T
where
	T: 'static + LogSink + Clone,
{
	fn clone_box(&self) -> Box<dyn LogSink> {
		Box::new(self.clone())
	}
}

pub trait LogSink: LogSinkClone + Sync + Send {
	fn write_log(&self, level: Level, prefix: &str, message: &str);
	fn write_result(&self, message: &str);
}

impl Clone for Box<dyn LogSink> {
	fn clone(&self) -> Box<dyn LogSink> {
		self.clone_box()
	}
}

/// The basic log sink that writes output to stdout, with colors when relevant.
#[derive(Clone)]
pub struct StdioLogSink {
	level: Level,
}

impl LogSink for StdioLogSink {
	fn write_log(&self, level: Level, prefix: &str, message: &str) {
		if level < self.level {
			return;
		}

		emit(level, prefix, message);
	}

	fn write_result(&self, message: &str) {
		println!("{message}");
	}
}

#[derive(Clone)]
pub struct FileLogSink {
	level: Level,
	file: Arc<std::sync::Mutex<std::fs::File>>,
}

const FILE_LOG_SIZE_LIMIT: u64 = 1024 * 1024 * 10; // 10MB

impl FileLogSink {
	pub fn new(level: Level, path: &Path) -> std::io::Result<Self> {
		// Truncate the service log occasionally to avoid growing infinitely
		if matches!(path.metadata(), Ok(m) if m.len() > FILE_LOG_SIZE_LIMIT) {
			// ignore errors, can happen if another process is writing right now
			let _ = std::fs::remove_file(path);
		}

		let file = std::fs::OpenOptions::new()
			.append(true)
			.create(true)
			.open(path)?;

		Ok(Self {
			level,
			file: Arc::new(std::sync::Mutex::new(file)),
		})
	}
}

impl LogSink for FileLogSink {
	fn write_log(&self, level: Level, prefix: &str, message: &str) {
		if level < self.level {
			return;
		}

		let line = format(level, prefix, message, false);

		// ignore any errors, not much we can do if logging fails...
		self.file.lock().unwrap().write_all(line.as_bytes()).ok();
	}

	fn write_result(&self, _message: &str) {}
}

impl Logger {
	pub fn test() -> Self {
		Self {
			tracer: Arc::new(TracerProvider::builder().build().tracer("codeclitest")),
			sink: vec![],
			prefix: None,
		}
	}

	pub fn new(tracer: Tracer, level: Level) -> Self {
		Self {
			tracer: Arc::new(tracer),
			sink: vec![Box::new(StdioLogSink { level })],
			prefix: None,
		}
	}

	pub fn span(&self, name: &str) -> SpanBuilder {
		self.tracer.span_builder(format!("serverlauncher/{name}"))
	}

	pub fn tracer(&self) -> &Tracer {
		&self.tracer
	}

	pub fn emit(&self, level: Level, message: &str) {
		let prefix = self.prefix.as_deref().unwrap_or("");
		for sink in &self.sink {
			sink.write_log(level, prefix, message);
		}
	}

	pub fn result(&self, message: impl AsRef<str>) {
		for sink in &self.sink {
			sink.write_result(message.as_ref());
		}
	}

	pub fn prefixed(&self, prefix: &str) -> Logger {
		Logger {
			prefix: Some(match &self.prefix {
				Some(p) => format!("{p}{prefix} "),
				None => format!("{prefix} "),
			}),
			..self.clone()
		}
	}

	/// Creates a new logger with the additional log sink added.
	pub fn tee<T>(&self, sink: T) -> Logger
	where
		T: LogSink + 'static,
	{
		let mut new_sinks = self.sink.clone();
		new_sinks.push(Box::new(sink));

		Logger {
			sink: new_sinks,
			..self.clone()
		}
	}

	/// Creates a new logger with the sink replace with the given sink.
	pub fn with_sink<T>(&self, sink: T) -> Logger
	where
		T: LogSink + 'static,
	{
		Logger {
			sink: vec![Box::new(sink)],
			..self.clone()
		}
	}

	pub fn get_download_logger<'a>(&'a self, prefix: &'static str) -> DownloadLogger<'a> {
		DownloadLogger {
			prefix,
			logger: self,
		}
	}
}

pub struct DownloadLogger<'a> {
	prefix: &'static str,
	logger: &'a Logger,
}

impl crate::util::io::ReportCopyProgress for DownloadLogger<'_> {
	fn report_progress(&mut self, bytes_so_far: u64, total_bytes: u64) {
		if total_bytes > 0 {
			self.logger.emit(
				Level::Trace,
				&format!(
					"{} {}/{} ({:.0}%)",
					self.prefix,
					bytes_so_far,
					total_bytes,
					(bytes_so_far as f64 / total_bytes as f64) * 100.0,
				),
			);
		} else {
			self.logger.emit(
				Level::Trace,
				&format!("{} {}/{}", self.prefix, bytes_so_far, total_bytes,),
			);
		}
	}
}

fn format(level: Level, prefix: &str, message: &str, use_colors: bool) -> String {
	let current = Local::now();
	let timestamp = current.format("%Y-%m-%d %H:%M:%S").to_string();

	let name = level.name().unwrap();

	if use_colors {
		if let Some(c) = level.color_code() {
			return format!("\x1b[2m[{timestamp}]\x1b[0m {c}{name}\x1b[0m {prefix}{message}\n");
		}
	}

	format!("[{timestamp}] {name} {prefix}{message}\n")
}

pub fn emit(level: Level, prefix: &str, message: &str) {
	let line = format(level, prefix, message, *COLORS_ENABLED);
	if level == Level::Trace && *COLORS_ENABLED {
		print!("\x1b[2m{line}\x1b[0m");
	} else {
		print!("{line}");
	}
}

/// Installs the logger instance as the global logger for the 'log' service.
/// Replaces any existing registered logger. Note that the logger will be leaked/
pub fn install_global_logger(log: Logger) {
	log::set_logger(Box::leak(Box::new(RustyLogger(log))))
		.map(|()| log::set_max_level(log::LevelFilter::Debug))
		.expect("expected to make logger");
}

/// Logger that uses the common rust "log" crate and directs back to one of
/// our managed loggers.
struct RustyLogger(Logger);

impl log::Log for RustyLogger {
	fn enabled(&self, metadata: &log::Metadata) -> bool {
		metadata.level() <= log::Level::Debug
	}

	fn log(&self, record: &log::Record) {
		if !self.enabled(record.metadata()) {
			return;
		}

		// exclude noisy log modules:
		let src = match record.module_path() {
			Some("russh::cipher" | "russh::negotiation" | "russh::kex::dh") => return,
			Some(s) => s,
			None => "<unknown>",
		};

		self.0.emit(
			match record.level() {
				log::Level::Debug => Level::Debug,
				log::Level::Error => Level::Error,
				log::Level::Info => Level::Info,
				log::Level::Trace => Level::Trace,
				log::Level::Warn => Level::Warn,
			},
			&format!("[{}] {}", src, record.args()),
		);
	}

	fn flush(&self) {}
}

#[macro_export]
macro_rules! error {
    ($logger:expr, $str:expr) => {
        $logger.emit(log::Level::Error, $str)
     };
     ($logger:expr, $($fmt:expr),+) => {
        $logger.emit(log::Level::Error, &format!($($fmt),+))
     };
 }

#[macro_export]
macro_rules! trace {
     ($logger:expr, $str:expr) => {
         $logger.emit(log::Level::Trace, $str)
     };
     ($logger:expr, $($fmt:expr),+) => {
         $logger.emit(log::Level::Trace, &format!($($fmt),+))
     };
 }

#[macro_export]
macro_rules! debug {
     ($logger:expr, $str:expr) => {
         $logger.emit(log::Level::Debug, $str)
     };
     ($logger:expr, $($fmt:expr),+) => {
         $logger.emit(log::Level::Debug, &format!($($fmt),+))
     };
 }

#[macro_export]
macro_rules! info {
     ($logger:expr, $str:expr) => {
         $logger.emit(log::Level::Info, $str)
     };
     ($logger:expr, $($fmt:expr),+) => {
         $logger.emit(log::Level::Info, &format!($($fmt),+))
     };
 }

#[macro_export]
macro_rules! warning {
     ($logger:expr, $str:expr) => {
         $logger.emit(log::Level::Warn, $str)
     };
     ($logger:expr, $($fmt:expr),+) => {
         $logger.emit(log::Level::Warn, &format!($($fmt),+))
     };
 }

#[macro_export]
macro_rules! span {
	($logger:expr, $span:expr, $func:expr) => {{
		use opentelemetry::trace::TraceContextExt;

		let span = $span.start($logger.tracer());
		let cx = opentelemetry::Context::current_with_span(span);
		let guard = cx.clone().attach();
		let t = $func;

		if let Err(e) = &t {
			cx.span().record_error(e);
		}

		std::mem::drop(guard);

		t
	}};
}

#[macro_export]
macro_rules! spanf {
	($logger:expr, $span:expr, $func:expr) => {{
		use opentelemetry::trace::{FutureExt, TraceContextExt};

		let span = $span.start($logger.tracer());
		let cx = opentelemetry::Context::current_with_span(span);
		let t = $func.with_context(cx.clone()).await;

		if let Err(e) = &t {
			cx.span().record_error(e);
		}

		cx.span().end();

		t
	}};
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/msgpack_rpc.rs]---
Location: vscode-main/cli/src/msgpack_rpc.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use bytes::Buf;
use serde::de::DeserializeOwned;
use tokio::{
	io::{AsyncRead, AsyncReadExt, AsyncWrite, AsyncWriteExt},
	pin,
	sync::mpsc,
};
use tokio_util::codec::Decoder;

use crate::{
	rpc::{self, MaybeSync, Serialization},
	util::{
		errors::{AnyError, InvalidRpcDataError},
		sync::{Barrier, Receivable},
	},
};
use std::io::{self, Cursor, ErrorKind};

#[derive(Copy, Clone)]
pub struct MsgPackSerializer {}

impl Serialization for MsgPackSerializer {
	fn serialize(&self, value: impl serde::Serialize) -> Vec<u8> {
		rmp_serde::to_vec_named(&value).expect("expected to serialize")
	}

	fn deserialize<P: serde::de::DeserializeOwned>(&self, b: &[u8]) -> Result<P, AnyError> {
		rmp_serde::from_slice(b).map_err(|e| InvalidRpcDataError(e.to_string()).into())
	}
}

pub type MsgPackCaller = rpc::RpcCaller<MsgPackSerializer>;

/// Creates a new RPC Builder that serializes to msgpack.
pub fn new_msgpack_rpc() -> rpc::RpcBuilder<MsgPackSerializer> {
	rpc::RpcBuilder::new(MsgPackSerializer {})
}

/// Starting processing msgpack rpc over the given i/o. It's recommended that
/// the reader be passed in as a BufReader for efficiency.
pub async fn start_msgpack_rpc<
	C: Send + Sync + 'static,
	X: Clone,
	S: Send + Sync + Serialization,
	Read: AsyncRead + Unpin,
	Write: AsyncWrite + Unpin,
>(
	dispatcher: rpc::RpcDispatcher<S, C>,
	mut read: Read,
	mut write: Write,
	mut msg_rx: impl Receivable<Vec<u8>>,
	mut shutdown_rx: Barrier<X>,
) -> io::Result<(Option<X>, Read, Write)> {
	let (write_tx, mut write_rx) = mpsc::channel::<Vec<u8>>(8);
	let mut decoder = MsgPackCodec::new();
	let mut decoder_buf = bytes::BytesMut::new();

	let shutdown_fut = shutdown_rx.wait();
	pin!(shutdown_fut);

	loop {
		tokio::select! {
			r = read.read_buf(&mut decoder_buf) => {
				r?;

				while let Some(frame) = decoder.decode(&mut decoder_buf)? {
					match dispatcher.dispatch_with_partial(&frame.vec, frame.obj) {
						MaybeSync::Sync(Some(v)) => {
							let _ = write_tx.send(v).await;
						},
						MaybeSync::Sync(None) => continue,
						MaybeSync::Future(fut) => {
							let write_tx = write_tx.clone();
							tokio::spawn(async move {
								if let Some(v) = fut.await {
									let _ = write_tx.send(v).await;
								}
							});
						}
						MaybeSync::Stream((stream, fut)) => {
							if let Some(stream) = stream {
								dispatcher.register_stream(write_tx.clone(), stream).await;
							}
							let write_tx = write_tx.clone();
							tokio::spawn(async move {
								if let Some(v) = fut.await {
									let _ = write_tx.send(v).await;
								}
							});
						}
					}
				};
			},
			Some(m) = write_rx.recv() => {
				write.write_all(&m).await?;
			},
			Some(m) = msg_rx.recv_msg() => {
				write.write_all(&m).await?;
			},
			r = &mut shutdown_fut => return Ok((r.ok(), read, write)),
		}

		write.flush().await?;
	}
}

/// Reader that reads msgpack object messages in a cancellation-safe way using Tokio's codecs.
///
/// rmp_serde does not support async reads, and does not plan to. But we know every
/// type in protocol is some kind of object, so by asking to deserialize the
/// requested object from a reader (repeatedly, if incomplete) we can
/// accomplish streaming.
pub struct MsgPackCodec<T> {
	_marker: std::marker::PhantomData<T>,
}

impl<T> MsgPackCodec<T> {
	pub fn new() -> Self {
		Self {
			_marker: std::marker::PhantomData,
		}
	}
}

pub struct MsgPackDecoded<T> {
	pub obj: T,
	pub vec: Vec<u8>,
}

impl<T: DeserializeOwned> tokio_util::codec::Decoder for MsgPackCodec<T> {
	type Item = MsgPackDecoded<T>;
	type Error = io::Error;

	fn decode(&mut self, src: &mut bytes::BytesMut) -> Result<Option<Self::Item>, Self::Error> {
		let bytes_ref = src.as_ref();
		let mut cursor = Cursor::new(bytes_ref);

		match rmp_serde::decode::from_read::<_, T>(&mut cursor) {
			Err(
				rmp_serde::decode::Error::InvalidDataRead(e)
				| rmp_serde::decode::Error::InvalidMarkerRead(e),
			) if e.kind() == ErrorKind::UnexpectedEof => {
				src.reserve(1024);
				Ok(None)
			}
			Err(e) => Err(std::io::Error::new(
				std::io::ErrorKind::InvalidData,
				e.to_string(),
			)),
			Ok(obj) => {
				let len = cursor.position() as usize;
				let vec = src[..len].to_vec();
				src.advance(len);
				Ok(Some(MsgPackDecoded { obj, vec }))
			}
		}
	}
}

#[cfg(test)]
mod tests {
	use serde::{Deserialize, Serialize};

	use super::*;

	#[derive(Serialize, Deserialize, PartialEq, Eq, Debug)]
	pub struct Msg {
		pub x: i32,
	}

	#[test]
	fn test_protocol() {
		let mut c = MsgPackCodec::<Msg>::new();
		let mut buf = bytes::BytesMut::new();

		assert!(c.decode(&mut buf).unwrap().is_none());

		buf.extend_from_slice(rmp_serde::to_vec_named(&Msg { x: 1 }).unwrap().as_slice());
		buf.extend_from_slice(rmp_serde::to_vec_named(&Msg { x: 2 }).unwrap().as_slice());

		assert_eq!(
			c.decode(&mut buf).unwrap().expect("expected msg1").obj,
			Msg { x: 1 }
		);
		assert_eq!(
			c.decode(&mut buf).unwrap().expect("expected msg1").obj,
			Msg { x: 2 }
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/options.rs]---
Location: vscode-main/cli/src/options.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use std::fmt;

use serde::{Deserialize, Serialize};

use crate::constants::SERVER_NAME_MAP;

#[derive(clap::ValueEnum, Copy, Clone, Debug, Hash, PartialEq, Eq, Serialize, Deserialize)]
pub enum Quality {
	#[serde(rename = "stable")]
	Stable,
	#[serde(rename = "exploration")]
	Exploration,
	#[serde(other)]
	Insiders,
}

impl Quality {
	/// Lowercased quality name in paths and protocol
	pub fn get_machine_name(&self) -> &'static str {
		match self {
			Quality::Insiders => "insiders",
			Quality::Exploration => "exploration",
			Quality::Stable => "stable",
		}
	}

	/// Uppercased quality display name for humans
	pub fn get_capitalized_name(&self) -> &'static str {
		match self {
			Quality::Insiders => "Insiders",
			Quality::Exploration => "Exploration",
			Quality::Stable => "Stable",
		}
	}

	/// Server application name
	pub fn server_entrypoint(&self) -> String {
		let mut server_name = SERVER_NAME_MAP
			.as_ref()
			.and_then(|m| m.get(self))
			.map(|s| s.server_application_name.as_str())
			.unwrap_or("code-server-oss")
			.to_string();

		if cfg!(windows) {
			server_name.push_str(".cmd");
		}

		server_name
	}
}

impl fmt::Display for Quality {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		write!(f, "{}", self.get_capitalized_name())
	}
}

impl TryFrom<&str> for Quality {
	type Error = String;

	fn try_from(s: &str) -> Result<Self, Self::Error> {
		match s {
			"stable" => Ok(Quality::Stable),
			"insiders" | "insider" => Ok(Quality::Insiders),
			"exploration" => Ok(Quality::Exploration),
			_ => Err(format!(
				"Unknown quality: {s}. Must be one of stable, insiders, or exploration."
			)),
		}
	}
}

#[derive(clap::ValueEnum, Copy, Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub enum TelemetryLevel {
	Off,
	Crash,
	Error,
	All,
}

impl fmt::Display for TelemetryLevel {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		match self {
			TelemetryLevel::Off => write!(f, "off"),
			TelemetryLevel::Crash => write!(f, "crash"),
			TelemetryLevel::Error => write!(f, "error"),
			TelemetryLevel::All => write!(f, "all"),
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/rpc.rs]---
Location: vscode-main/cli/src/rpc.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use std::{
	collections::HashMap,
	future,
	sync::{
		atomic::{AtomicU32, Ordering},
		Arc, Mutex,
	},
};

use crate::log;
use futures::{future::BoxFuture, Future, FutureExt};
use serde::{de::DeserializeOwned, Deserialize, Serialize};
use tokio::{
	io::{AsyncReadExt, AsyncWriteExt, DuplexStream, WriteHalf},
	sync::{mpsc, oneshot},
};

use crate::util::errors::AnyError;

pub type SyncMethod = Arc<dyn Send + Sync + Fn(Option<u32>, &[u8]) -> Option<Vec<u8>>>;
pub type AsyncMethod =
	Arc<dyn Send + Sync + Fn(Option<u32>, &[u8]) -> BoxFuture<'static, Option<Vec<u8>>>>;
pub type Duplex = Arc<
	dyn Send
		+ Sync
		+ Fn(Option<u32>, &[u8]) -> (Option<StreamDto>, BoxFuture<'static, Option<Vec<u8>>>),
>;

pub enum Method {
	Sync(SyncMethod),
	Async(AsyncMethod),
	Duplex(Duplex),
}

/// Serialization is given to the RpcBuilder and defines how data gets serialized
/// when callinth methods.
pub trait Serialization: Send + Sync + 'static {
	fn serialize(&self, value: impl Serialize) -> Vec<u8>;
	fn deserialize<P: DeserializeOwned>(&self, b: &[u8]) -> Result<P, AnyError>;
}

/// RPC is a basic, transport-agnostic builder for RPC methods. You can
/// register methods to it, then call `.build()` to get a "dispatcher" type.
pub struct RpcBuilder<S> {
	serializer: Arc<S>,
	methods: HashMap<&'static str, Method>,
	calls: Arc<Mutex<HashMap<u32, DispatchMethod>>>,
}

impl<S: Serialization> RpcBuilder<S> {
	/// Creates a new empty RPC builder.
	pub fn new(serializer: S) -> Self {
		Self {
			serializer: Arc::new(serializer),
			methods: HashMap::new(),
			calls: Arc::new(std::sync::Mutex::new(HashMap::new())),
		}
	}

	/// Creates a caller that will be connected to any eventual dispatchers,
	/// and that sends data to the "tx" channel.
	pub fn get_caller(&mut self, sender: mpsc::UnboundedSender<Vec<u8>>) -> RpcCaller<S> {
		RpcCaller {
			serializer: self.serializer.clone(),
			calls: self.calls.clone(),
			sender,
		}
	}

	/// Gets a method builder.
	pub fn methods<C: Send + Sync + 'static>(self, context: C) -> RpcMethodBuilder<S, C> {
		RpcMethodBuilder {
			context: Arc::new(context),
			serializer: self.serializer,
			methods: self.methods,
			calls: self.calls,
		}
	}
}

pub struct RpcMethodBuilder<S, C> {
	context: Arc<C>,
	serializer: Arc<S>,
	methods: HashMap<&'static str, Method>,
	calls: Arc<Mutex<HashMap<u32, DispatchMethod>>>,
}

#[derive(Serialize)]
struct DuplexStreamStarted {
	pub for_request_id: u32,
	pub stream_ids: Vec<u32>,
}

impl<S: Serialization, C: Send + Sync + 'static> RpcMethodBuilder<S, C> {
	/// Registers a synchronous rpc call that returns its result directly.
	pub fn register_sync<P, R, F>(&mut self, method_name: &'static str, callback: F)
	where
		P: DeserializeOwned,
		R: Serialize,
		F: Fn(P, &C) -> Result<R, AnyError> + Send + Sync + 'static,
	{
		if self.methods.contains_key(method_name) {
			panic!("Method already registered: {method_name}");
		}

		let serial = self.serializer.clone();
		let context = self.context.clone();
		self.methods.insert(
			method_name,
			Method::Sync(Arc::new(move |id, body| {
				let param = match serial.deserialize::<RequestParams<P>>(body) {
					Ok(p) => p,
					Err(err) => {
						return id.map(|id| {
							serial.serialize(ErrorResponse {
								id,
								error: ResponseError {
									code: 0,
									message: format!("{err:?}"),
								},
							})
						})
					}
				};

				match callback(param.params, &context) {
					Ok(result) => id.map(|id| serial.serialize(&SuccessResponse { id, result })),
					Err(err) => id.map(|id| {
						serial.serialize(ErrorResponse {
							id,
							error: ResponseError {
								code: -1,
								message: format!("{err:?}"),
							},
						})
					}),
				}
			})),
		);
	}

	/// Registers an async rpc call that returns a Future.
	pub fn register_async<P, R, Fut, F>(&mut self, method_name: &'static str, callback: F)
	where
		P: DeserializeOwned + Send + 'static,
		R: Serialize + Send + Sync + 'static,
		Fut: Future<Output = Result<R, AnyError>> + Send,
		F: (Fn(P, Arc<C>) -> Fut) + Clone + Send + Sync + 'static,
	{
		let serial = self.serializer.clone();
		let context = self.context.clone();
		self.methods.insert(
			method_name,
			Method::Async(Arc::new(move |id, body| {
				let param = match serial.deserialize::<RequestParams<P>>(body) {
					Ok(p) => p,
					Err(err) => {
						return future::ready(id.map(|id| {
							serial.serialize(ErrorResponse {
								id,
								error: ResponseError {
									code: 0,
									message: format!("{err:?}"),
								},
							})
						}))
						.boxed();
					}
				};

				let callback = callback.clone();
				let serial = serial.clone();
				let context = context.clone();
				let fut = async move {
					match callback(param.params, context).await {
						Ok(result) => {
							id.map(|id| serial.serialize(&SuccessResponse { id, result }))
						}
						Err(err) => id.map(|id| {
							serial.serialize(ErrorResponse {
								id,
								error: ResponseError {
									code: -1,
									message: format!("{err:?}"),
								},
							})
						}),
					}
				};

				fut.boxed()
			})),
		);
	}

	/// Registers an async rpc call that returns a Future containing a duplex
	/// stream that should be handled by the client.
	pub fn register_duplex<P, R, Fut, F>(
		&mut self,
		method_name: &'static str,
		streams: usize,
		callback: F,
	) where
		P: DeserializeOwned + Send + 'static,
		R: Serialize + Send + Sync + 'static,
		Fut: Future<Output = Result<R, AnyError>> + Send,
		F: (Fn(Vec<DuplexStream>, P, Arc<C>) -> Fut) + Clone + Send + Sync + 'static,
	{
		let serial = self.serializer.clone();
		let context = self.context.clone();
		self.methods.insert(
			method_name,
			Method::Duplex(Arc::new(move |id, body| {
				let param = match serial.deserialize::<RequestParams<P>>(body) {
					Ok(p) => p,
					Err(err) => {
						return (
							None,
							future::ready(id.map(|id| {
								serial.serialize(ErrorResponse {
									id,
									error: ResponseError {
										code: 0,
										message: format!("{err:?}"),
									},
								})
							}))
							.boxed(),
						);
					}
				};

				let callback = callback.clone();
				let serial = serial.clone();
				let context = context.clone();

				let mut dto = StreamDto {
					req_id: id.unwrap_or(0),
					streams: Vec::with_capacity(streams),
				};
				let mut servers = Vec::with_capacity(streams);

				for _ in 0..streams {
					let (client, server) = tokio::io::duplex(8192);
					servers.push(server);
					dto.streams.push((next_message_id(), client));
				}

				let fut = async move {
					match callback(servers, param.params, context).await {
						Ok(r) => id.map(|id| serial.serialize(&SuccessResponse { id, result: r })),
						Err(err) => id.map(|id| {
							serial.serialize(ErrorResponse {
								id,
								error: ResponseError {
									code: -1,
									message: format!("{err:?}"),
								},
							})
						}),
					}
				};

				(Some(dto), fut.boxed())
			})),
		);
	}

	/// Builds into a usable, sync rpc dispatcher.
	pub fn build(mut self, log: log::Logger) -> RpcDispatcher<S, C> {
		let streams = Streams::default();

		let s1 = streams.clone();
		self.register_async(METHOD_STREAM_ENDED, move |m: StreamEndedParams, _| {
			let s1 = s1.clone();
			async move {
				s1.remove(m.stream).await;
				Ok(())
			}
		});

		let s2 = streams.clone();
		self.register_sync(METHOD_STREAM_DATA, move |m: StreamDataIncomingParams, _| {
			s2.write(m.stream, m.segment);
			Ok(())
		});

		RpcDispatcher {
			log,
			context: self.context,
			calls: self.calls,
			serializer: self.serializer,
			methods: Arc::new(self.methods),
			streams,
		}
	}
}

type DispatchMethod = Box<dyn Send + Sync + FnOnce(Outcome)>;

/// Dispatcher returned from a Builder that provides a transport-agnostic way to
/// deserialize and dispatch RPC calls. This structure may get more advanced as
/// time goes on...
#[derive(Clone)]
pub struct RpcCaller<S: Serialization> {
	serializer: Arc<S>,
	calls: Arc<Mutex<HashMap<u32, DispatchMethod>>>,
	sender: mpsc::UnboundedSender<Vec<u8>>,
}

impl<S: Serialization> RpcCaller<S> {
	pub fn serialize_notify<M, A>(serializer: &S, method: M, params: A) -> Vec<u8>
	where
		S: Serialization,
		M: AsRef<str> + serde::Serialize,
		A: Serialize,
	{
		serializer.serialize(&FullRequest {
			id: None,
			method,
			params,
		})
	}

	/// Enqueues an outbound call. Returns whether the message was enqueued.
	pub fn notify<M, A>(&self, method: M, params: A) -> bool
	where
		M: AsRef<str> + serde::Serialize,
		A: Serialize,
	{
		self.sender
			.send(Self::serialize_notify(&self.serializer, method, params))
			.is_ok()
	}

	/// Enqueues an outbound call, returning its result.
	pub fn call<M, A, R>(&self, method: M, params: A) -> oneshot::Receiver<Result<R, ResponseError>>
	where
		M: AsRef<str> + serde::Serialize,
		A: Serialize,
		R: DeserializeOwned + Send + 'static,
	{
		let (tx, rx) = oneshot::channel();
		let id = next_message_id();
		let body = self.serializer.serialize(&FullRequest {
			id: Some(id),
			method,
			params,
		});

		if self.sender.send(body).is_err() {
			drop(tx);
			return rx;
		}

		let serializer = self.serializer.clone();
		self.calls.lock().unwrap().insert(
			id,
			Box::new(move |body| {
				match body {
					Outcome::Error(e) => tx.send(Err(e)).ok(),
					Outcome::Success(r) => match serializer.deserialize::<SuccessResponse<R>>(&r) {
						Ok(r) => tx.send(Ok(r.result)).ok(),
						Err(err) => tx
							.send(Err(ResponseError {
								code: 0,
								message: err.to_string(),
							}))
							.ok(),
					},
				};
			}),
		);

		rx
	}
}

/// Dispatcher returned from a Builder that provides a transport-agnostic way to
/// deserialize and handle RPC calls. This structure may get more advanced as
/// time goes on...
#[derive(Clone)]
pub struct RpcDispatcher<S, C> {
	log: log::Logger,
	context: Arc<C>,
	serializer: Arc<S>,
	methods: Arc<HashMap<&'static str, Method>>,
	calls: Arc<Mutex<HashMap<u32, DispatchMethod>>>,
	streams: Streams,
}

static MESSAGE_ID_COUNTER: AtomicU32 = AtomicU32::new(0);
fn next_message_id() -> u32 {
	MESSAGE_ID_COUNTER.fetch_add(1, Ordering::SeqCst)
}

impl<S: Serialization, C: Send + Sync> RpcDispatcher<S, C> {
	/// Runs the incoming request, returning the result of the call synchronously
	/// or in a future. (The caller can then decide whether to run the future
	/// sequentially in its receive loop, or not.)
	///
	/// The future or return result will be optional bytes that should be sent
	/// back to the socket.
	pub fn dispatch(&self, body: &[u8]) -> MaybeSync {
		match self.serializer.deserialize::<PartialIncoming>(body) {
			Ok(partial) => self.dispatch_with_partial(body, partial),
			Err(_err) => {
				warning!(self.log, "Failed to deserialize request, hex: {:X?}", body);
				MaybeSync::Sync(None)
			}
		}
	}

	/// Like dispatch, but allows passing an existing PartialIncoming.
	pub fn dispatch_with_partial(&self, body: &[u8], partial: PartialIncoming) -> MaybeSync {
		let id = partial.id;

		if let Some(method_name) = partial.method {
			let method = self.methods.get(method_name.as_str());
			match method {
				Some(Method::Sync(callback)) => MaybeSync::Sync(callback(id, body)),
				Some(Method::Async(callback)) => MaybeSync::Future(callback(id, body)),
				Some(Method::Duplex(callback)) => MaybeSync::Stream(callback(id, body)),
				None => MaybeSync::Sync(id.map(|id| {
					self.serializer.serialize(ErrorResponse {
						id,
						error: ResponseError {
							code: -1,
							message: format!("Method not found: {method_name}"),
						},
					})
				})),
			}
		} else if let Some(err) = partial.error {
			if let Some(cb) = self.calls.lock().unwrap().remove(&id.unwrap()) {
				cb(Outcome::Error(err));
			}
			MaybeSync::Sync(None)
		} else {
			if let Some(cb) = self.calls.lock().unwrap().remove(&id.unwrap()) {
				cb(Outcome::Success(body.to_vec()));
			}
			MaybeSync::Sync(None)
		}
	}

	/// Registers a stream call returned from dispatch().
	pub async fn register_stream(
		&self,
		write_tx: mpsc::Sender<impl 'static + From<Vec<u8>> + Send>,
		dto: StreamDto,
	) {
		let r = write_tx
			.send(
				self.serializer
					.serialize(&FullRequest {
						id: None,
						method: METHOD_STREAMS_STARTED,
						params: DuplexStreamStarted {
							stream_ids: dto.streams.iter().map(|(id, _)| *id).collect(),
							for_request_id: dto.req_id,
						},
					})
					.into(),
			)
			.await;

		if r.is_err() {
			return;
		}

		for (stream_id, duplex) in dto.streams {
			let (mut read, write) = tokio::io::split(duplex);
			self.streams.insert(stream_id, write);

			let write_tx = write_tx.clone();
			let serial = self.serializer.clone();
			tokio::spawn(async move {
				let mut buf = vec![0; 4096];
				loop {
					match read.read(&mut buf).await {
						Ok(0) | Err(_) => break,
						Ok(n) => {
							let r = write_tx
								.send(
									serial
										.serialize(&FullRequest {
											id: None,
											method: METHOD_STREAM_DATA,
											params: StreamDataParams {
												segment: &buf[..n],
												stream: stream_id,
											},
										})
										.into(),
								)
								.await;

							if r.is_err() {
								return;
							}
						}
					}
				}

				let _ = write_tx
					.send(
						serial
							.serialize(&FullRequest {
								id: None,
								method: METHOD_STREAM_ENDED,
								params: StreamEndedParams { stream: stream_id },
							})
							.into(),
					)
					.await;
			});
		}
	}

	pub fn context(&self) -> Arc<C> {
		self.context.clone()
	}
}

struct StreamRec {
	write: Option<WriteHalf<DuplexStream>>,
	q: Vec<Vec<u8>>,
	ended: bool,
}

#[derive(Clone, Default)]
struct Streams {
	map: Arc<std::sync::Mutex<HashMap<u32, StreamRec>>>,
}

impl Streams {
	pub async fn remove(&self, id: u32) {
		let mut remove = None;

		{
			let mut map = self.map.lock().unwrap();
			if let Some(s) = map.get_mut(&id) {
				if let Some(w) = s.write.take() {
					map.remove(&id);
					remove = Some(w);
				} else {
					s.ended = true; // will shut down in write loop
				}
			}
		}

		// do this outside of the sync lock:
		if let Some(mut w) = remove {
			let _ = w.shutdown().await;
		}
	}

	pub fn write(&self, id: u32, buf: Vec<u8>) {
		let mut map = self.map.lock().unwrap();
		if let Some(s) = map.get_mut(&id) {
			s.q.push(buf);

			if let Some(w) = s.write.take() {
				tokio::spawn(write_loop(id, w, self.map.clone()));
			}
		}
	}

	pub fn insert(&self, id: u32, stream: WriteHalf<DuplexStream>) {
		self.map.lock().unwrap().insert(
			id,
			StreamRec {
				write: Some(stream),
				q: Vec::new(),
				ended: false,
			},
		);
	}
}

/// Write loop started by `Streams.write`. It takes the WriteHalf, and
/// runs until there's no more items in the 'write queue'. At that point, if the
/// record still exists in the `streams` (i.e. we haven't shut down), it'll
/// return the WriteHalf so that the next `write` call starts
/// the loop again. Otherwise, it'll shut down the WriteHalf.
///
/// This is the equivalent of the same write_loop in the server_multiplexer.
/// I couldn't figure out a nice way to abstract it without introducing
/// performance overhead...
async fn write_loop(
	id: u32,
	mut w: WriteHalf<DuplexStream>,
	streams: Arc<std::sync::Mutex<HashMap<u32, StreamRec>>>,
) {
	let mut items_vec = vec![];
	loop {
		{
			let mut lock = streams.lock().unwrap();
			let stream_rec = match lock.get_mut(&id) {
				Some(b) => b,
				None => break,
			};

			if stream_rec.q.is_empty() {
				if stream_rec.ended {
					lock.remove(&id);
					break;
				} else {
					stream_rec.write = Some(w);
					return;
				}
			}

			std::mem::swap(&mut stream_rec.q, &mut items_vec);
		}

		for item in items_vec.drain(..) {
			if w.write_all(&item).await.is_err() {
				break;
			}
		}
	}

	let _ = w.shutdown().await; // got here from `break` above, meaning our record got cleared. Close the bridge if so
}

const METHOD_STREAMS_STARTED: &str = "streams_started";
const METHOD_STREAM_DATA: &str = "stream_data";
const METHOD_STREAM_ENDED: &str = "stream_ended";

#[allow(dead_code)] // false positive
trait AssertIsSync: Sync {}
impl<S: Serialization, C: Send + Sync> AssertIsSync for RpcDispatcher<S, C> {}

/// Approximate shape that is used to determine what kind of data is incoming.
#[derive(Deserialize, Debug)]
pub struct PartialIncoming {
	pub id: Option<u32>,
	pub method: Option<String>,
	pub error: Option<ResponseError>,
}

#[derive(Deserialize)]
struct StreamDataIncomingParams {
	#[serde(with = "serde_bytes")]
	pub segment: Vec<u8>,
	pub stream: u32,
}

#[derive(Serialize, Deserialize)]
struct StreamDataParams<'a> {
	#[serde(with = "serde_bytes")]
	pub segment: &'a [u8],
	pub stream: u32,
}

#[derive(Serialize, Deserialize)]
struct StreamEndedParams {
	pub stream: u32,
}

#[derive(Serialize)]
pub struct FullRequest<M: AsRef<str>, P> {
	pub id: Option<u32>,
	pub method: M,
	pub params: P,
}

#[derive(Deserialize)]
struct RequestParams<P> {
	pub params: P,
}

#[derive(Serialize, Deserialize)]
struct SuccessResponse<T> {
	pub id: u32,
	pub result: T,
}

#[derive(Serialize, Deserialize)]
struct ErrorResponse {
	pub id: u32,
	pub error: ResponseError,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ResponseError {
	pub code: i32,
	pub message: String,
}

enum Outcome {
	Success(Vec<u8>),
	Error(ResponseError),
}

pub struct StreamDto {
	req_id: u32,
	streams: Vec<(u32, DuplexStream)>,
}

pub enum MaybeSync {
	Stream((Option<StreamDto>, BoxFuture<'static, Option<Vec<u8>>>)),
	Future(BoxFuture<'static, Option<Vec<u8>>>),
	Sync(Option<Vec<u8>>),
}

#[cfg(test)]
mod tests {
	use super::*;

	#[tokio::test]
	async fn test_remove() {
		let streams = Streams::default();
		let (writer, mut reader) = tokio::io::duplex(1024);
		streams.insert(1, tokio::io::split(writer).1);
		streams.remove(1).await;

		assert!(streams.map.lock().unwrap().get(&1).is_none());
		let mut buffer = Vec::new();
		assert_eq!(reader.read_to_end(&mut buffer).await.unwrap(), 0);
	}

	#[tokio::test]
	async fn test_write() {
		let streams = Streams::default();
		let (writer, mut reader) = tokio::io::duplex(1024);
		streams.insert(1, tokio::io::split(writer).1);
		streams.write(1, vec![1, 2, 3]);

		let mut buffer = [0; 3];
		assert_eq!(reader.read_exact(&mut buffer).await.unwrap(), 3);
		assert_eq!(buffer, [1, 2, 3]);
	}

	#[tokio::test]
	async fn test_write_with_immediate_end() {
		let streams = Streams::default();
		let (writer, mut reader) = tokio::io::duplex(1);
		streams.insert(1, tokio::io::split(writer).1);
		streams.write(1, vec![1, 2, 3]); // spawn write loop
		streams.write(1, vec![4, 5, 6]); // enqueued while writing
		streams.remove(1).await; // end stream

		let mut buffer = Vec::new();
		assert_eq!(reader.read_to_end(&mut buffer).await.unwrap(), 6);
		assert_eq!(buffer, vec![1, 2, 3, 4, 5, 6]);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/self_update.rs]---
Location: vscode-main/cli/src/self_update.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use std::{fs, path::Path};
use tempfile::tempdir;

use crate::{
	constants::{VSCODE_CLI_COMMIT, VSCODE_CLI_QUALITY},
	options::Quality,
	update_service::{unzip_downloaded_release, Platform, Release, TargetKind, UpdateService},
	util::{
		command::new_std_command,
		errors::{wrap, AnyError, CodeError, CorruptDownload},
		http,
		io::{ReportCopyProgress, SilentCopyProgress},
	},
};

pub struct SelfUpdate<'a> {
	commit: &'static str,
	quality: Quality,
	platform: Platform,
	update_service: &'a UpdateService,
}

static OLD_UPDATE_EXTENSION: &str = "Updating CLI";

impl<'a> SelfUpdate<'a> {
	pub fn new(update_service: &'a UpdateService) -> Result<Self, AnyError> {
		let commit = VSCODE_CLI_COMMIT
			.ok_or_else(|| CodeError::UpdatesNotConfigured("unknown build commit"))?;

		let quality = VSCODE_CLI_QUALITY
			.ok_or_else(|| CodeError::UpdatesNotConfigured("no configured quality"))
			.and_then(|q| {
				Quality::try_from(q).map_err(|_| CodeError::UpdatesNotConfigured("unknown quality"))
			})?;

		let platform = Platform::env_default().ok_or_else(|| {
			CodeError::UpdatesNotConfigured("Unknown platform, please report this error")
		})?;

		Ok(Self {
			commit,
			quality,
			platform,
			update_service,
		})
	}

	/// Gets the current release
	pub async fn get_current_release(&self) -> Result<Release, AnyError> {
		self.update_service
			.get_latest_commit(self.platform, TargetKind::Cli, self.quality)
			.await
	}

	/// Gets whether the given release is what this CLI is built against
	pub fn is_up_to_date_with(&self, release: &Release) -> bool {
		release.commit == self.commit
	}

	/// Cleans up old self-updated binaries. Should be called with regularity.
	/// May fail if old versions are still running.
	pub fn cleanup_old_update(&self) -> Result<(), std::io::Error> {
		let current_path = std::env::current_exe()?;
		let old_path = current_path.with_extension(OLD_UPDATE_EXTENSION);
		if old_path.exists() {
			fs::remove_file(old_path)?;
		}

		Ok(())
	}

	/// Updates the CLI to the given release.
	pub async fn do_update(
		&self,
		release: &Release,
		progress: impl ReportCopyProgress,
	) -> Result<(), AnyError> {
		// 1. Download the archive into a temporary directory
		let tempdir = tempdir().map_err(|e| wrap(e, "Failed to create temp dir"))?;
		let stream = self.update_service.get_download_stream(release).await?;
		let archive_path = tempdir.path().join(stream.url_path_basename().unwrap());
		http::download_into_file(&archive_path, progress, stream).await?;

		// 2. Unzip the archive and get the binary
		let target_path =
			std::env::current_exe().map_err(|e| wrap(e, "could not get current exe"))?;
		let staging_path = target_path.with_extension(".update");
		let archive_contents_path = tempdir.path().join("content");
		// unzipping the single binary is pretty small and fast--don't bother with passing progress
		unzip_downloaded_release(&archive_path, &archive_contents_path, SilentCopyProgress())?;
		copy_updated_cli_to_path(&archive_contents_path, &staging_path)?;

		// 3. Copy file metadata, make sure the new binary is executable\
		copy_file_metadata(&target_path, &staging_path)
			.map_err(|e| wrap(e, "failed to set file permissions"))?;
		validate_cli_is_good(&staging_path)?;

		// Try to rename the old CLI to the tempdir, where it can get cleaned up by the
		// OS later. However, this can fail if the tempdir is on a different drive
		// than the installation dir. In this case just rename it to ".old".
		if fs::rename(&target_path, tempdir.path().join("old-code-cli")).is_err() {
			fs::rename(
				&target_path,
				target_path.with_extension(OLD_UPDATE_EXTENSION),
			)
			.map_err(|e| wrap(e, "failed to rename old CLI"))?;
		}

		fs::rename(&staging_path, &target_path)
			.map_err(|e| wrap(e, "failed to rename newly installed CLI"))?;

		Ok(())
	}
}

fn validate_cli_is_good(exe_path: &Path) -> Result<(), AnyError> {
	let o = new_std_command(exe_path)
		.args(["--version"])
		.output()
		.map_err(|e| CorruptDownload(format!("could not execute new binary, aborting: {e}")))?;

	if !o.status.success() {
		let msg = format!(
			"could not execute new binary, aborting. Stdout:\n\n{}\n\nStderr:\n\n{}",
			String::from_utf8_lossy(&o.stdout),
			String::from_utf8_lossy(&o.stderr),
		);

		return Err(CorruptDownload(msg).into());
	}

	Ok(())
}

fn copy_updated_cli_to_path(unzipped_content: &Path, staging_path: &Path) -> Result<(), AnyError> {
	let unzipped_files = fs::read_dir(unzipped_content)
		.map_err(|e| wrap(e, "could not read update contents"))?
		.collect::<Vec<_>>();
	if unzipped_files.len() != 1 {
		let msg = format!(
			"expected exactly one file in update, got {}",
			unzipped_files.len()
		);
		return Err(CorruptDownload(msg).into());
	}

	let archive_file = unzipped_files[0]
		.as_ref()
		.map_err(|e| wrap(e, "error listing update files"))?;
	fs::copy(archive_file.path(), staging_path)
		.map_err(|e| wrap(e, "error copying to staging file"))?;
	Ok(())
}

#[cfg(target_os = "windows")]
fn copy_file_metadata(from: &Path, to: &Path) -> Result<(), std::io::Error> {
	let permissions = from.metadata()?.permissions();
	fs::set_permissions(to, permissions)?;
	Ok(())
}

#[cfg(not(target_os = "windows"))]
fn copy_file_metadata(from: &Path, to: &Path) -> Result<(), std::io::Error> {
	use std::os::unix::ffi::OsStrExt;
	use std::os::unix::fs::MetadataExt;

	let metadata = from.metadata()?;
	fs::set_permissions(to, metadata.permissions())?;

	// based on coreutils' chown https://github.com/uutils/coreutils/blob/72b4629916abe0852ad27286f4e307fbca546b6e/src/chown/chown.rs#L266-L281
	let s = std::ffi::CString::new(to.as_os_str().as_bytes()).unwrap();
	let ret = unsafe { libc::chown(s.as_ptr(), metadata.uid(), metadata.gid()) };
	if ret != 0 {
		return Err(std::io::Error::last_os_error());
	}

	Ok(())
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/singleton.rs]---
Location: vscode-main/cli/src/singleton.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use serde::{Deserialize, Serialize};
use std::{
	fs::{File, OpenOptions},
	io::{Seek, SeekFrom, Write},
	path::{Path, PathBuf},
	time::Duration,
};
use sysinfo::{Pid, PidExt};

use crate::{
	async_pipe::{
		get_socket_name, get_socket_rw_stream, listen_socket_rw_stream, AsyncPipe,
		AsyncPipeListener,
	},
	util::{
		errors::CodeError,
		file_lock::{FileLock, Lock, PREFIX_LOCKED_BYTES},
		machine::wait_until_process_exits,
	},
};

pub struct SingletonServer {
	server: AsyncPipeListener,
	_lock: FileLock,
}

impl SingletonServer {
	pub async fn accept(&mut self) -> Result<AsyncPipe, CodeError> {
		self.server.accept().await
	}
}

pub enum SingletonConnection {
	/// This instance got the singleton lock. It started listening on a socket
	/// and has the read/write pair. If this gets dropped, the lock is released.
	Singleton(SingletonServer),
	/// Another instance is a singleton, and this client connected to it.
	Client(AsyncPipe),
}

/// Contents of the lock file; the listening socket ID and process ID
/// doing the listening.
#[derive(Deserialize, Serialize)]
struct LockFileMatter {
	socket_path: String,
	pid: u32,
}

/// Tries to acquire the singleton homed at the given lock file, either starting
/// a new singleton if it doesn't exist, or connecting otherwise.
pub async fn acquire_singleton(lock_file: &Path) -> Result<SingletonConnection, CodeError> {
	let file = OpenOptions::new()
		.read(true)
		.write(true)
		.create(true)
		.truncate(false)
		.open(lock_file)
		.map_err(CodeError::SingletonLockfileOpenFailed)?;

	match FileLock::acquire(file) {
		Ok(Lock::AlreadyLocked(mut file)) => connect_as_client_with_file(&mut file)
			.await
			.map(SingletonConnection::Client),
		Ok(Lock::Acquired(lock)) => start_singleton_server(lock)
			.await
			.map(SingletonConnection::Singleton),
		Err(e) => Err(e),
	}
}

/// Tries to connect to the singleton homed at the given file as a client.
pub async fn connect_as_client(lock_file: &Path) -> Result<AsyncPipe, CodeError> {
	let mut file = OpenOptions::new()
		.read(true)
		.open(lock_file)
		.map_err(CodeError::SingletonLockfileOpenFailed)?;

	connect_as_client_with_file(&mut file).await
}

async fn start_singleton_server(mut lock: FileLock) -> Result<SingletonServer, CodeError> {
	let socket_path = get_socket_name();

	let mut vec = Vec::with_capacity(128);
	let _ = vec.write(&[0; PREFIX_LOCKED_BYTES]);
	let _ = rmp_serde::encode::write(
		&mut vec,
		&LockFileMatter {
			socket_path: socket_path.to_string_lossy().to_string(),
			pid: std::process::id(),
		},
	);

	lock.file_mut()
		.write_all(&vec)
		.map_err(CodeError::SingletonLockfileOpenFailed)?;

	let server = listen_socket_rw_stream(&socket_path).await?;
	Ok(SingletonServer {
		server,
		_lock: lock,
	})
}

const MAX_CLIENT_ATTEMPTS: i32 = 10;

async fn connect_as_client_with_file(mut file: &mut File) -> Result<AsyncPipe, CodeError> {
	// retry, since someone else could get a lock and we could read it before
	// the JSON info was finished writing out
	let mut attempt = 0;
	loop {
		let _ = file.seek(SeekFrom::Start(PREFIX_LOCKED_BYTES as u64));
		let r = match rmp_serde::from_read::<_, LockFileMatter>(&mut file) {
			Ok(prev) => {
				let socket_path = PathBuf::from(prev.socket_path);

				tokio::select! {
					p = retry_get_socket_rw_stream(&socket_path, 5, Duration::from_millis(500)) => p,
					_ = wait_until_process_exits(Pid::from_u32(prev.pid), 500) => return Err(CodeError::SingletonLockedProcessExited(prev.pid)),
				}
			}
			Err(e) => Err(CodeError::SingletonLockfileReadFailed(e)),
		};

		if r.is_ok() || attempt == MAX_CLIENT_ATTEMPTS {
			return r;
		}

		attempt += 1;
		tokio::time::sleep(Duration::from_millis(500)).await;
	}
}

async fn retry_get_socket_rw_stream(
	path: &Path,
	max_tries: usize,
	interval: Duration,
) -> Result<AsyncPipe, CodeError> {
	for i in 0.. {
		match get_socket_rw_stream(path).await {
			Ok(s) => return Ok(s),
			Err(e) if i == max_tries => return Err(e),
			Err(_) => tokio::time::sleep(interval).await,
		}
	}

	unreachable!()
}

#[cfg(test)]
mod tests {
	use super::*;

	#[tokio::test]
	async fn test_acquires_singleton() {
		let dir = tempfile::tempdir().expect("expected to make temp dir");
		let s = acquire_singleton(&dir.path().join("lock"))
			.await
			.expect("expected to acquire");

		match s {
			SingletonConnection::Singleton(_) => {}
			_ => panic!("expected to be singleton"),
		}
	}

	#[tokio::test]
	async fn test_acquires_client() {
		let dir = tempfile::tempdir().expect("expected to make temp dir");
		let lockfile = dir.path().join("lock");
		let s1 = acquire_singleton(&lockfile)
			.await
			.expect("expected to acquire1");
		match s1 {
			SingletonConnection::Singleton(mut l) => tokio::spawn(async move {
				l.accept().await.expect("expected to accept");
			}),
			_ => panic!("expected to be singleton"),
		};

		let s2 = acquire_singleton(&lockfile)
			.await
			.expect("expected to acquire2");
		match s2 {
			SingletonConnection::Client(_) => {}
			_ => panic!("expected to be client"),
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/state.rs]---
Location: vscode-main/cli/src/state.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

extern crate dirs;

use std::{
	fs::{self, create_dir_all, read_to_string, remove_dir_all},
	io::Write,
	path::{Path, PathBuf},
	sync::{Arc, Mutex},
};

use serde::{de::DeserializeOwned, Serialize};

use crate::{
	constants::{DEFAULT_DATA_PARENT_DIR, VSCODE_CLI_QUALITY},
	download_cache::DownloadCache,
	util::errors::{wrap, AnyError, NoHomeForLauncherError, WrappedError},
};

const HOME_DIR_ALTS: [&str; 2] = ["$HOME", "~"];

#[derive(Clone)]
pub struct LauncherPaths {
	pub server_cache: DownloadCache,
	pub cli_cache: DownloadCache,
	root: PathBuf,
}

struct PersistedStateContainer<T>
where
	T: Clone + Serialize + DeserializeOwned + Default,
{
	path: PathBuf,
	state: Option<T>,
	#[allow(dead_code)]
	mode: u32,
}

impl<T> PersistedStateContainer<T>
where
	T: Clone + Serialize + DeserializeOwned + Default,
{
	fn load_or_get(&mut self) -> T {
		if let Some(state) = &self.state {
			return state.clone();
		}

		let state = if let Ok(s) = read_to_string(&self.path) {
			serde_json::from_str::<T>(&s).unwrap_or_default()
		} else {
			T::default()
		};

		self.state = Some(state.clone());
		state
	}

	fn save(&mut self, state: T) -> Result<(), WrappedError> {
		let s = serde_json::to_string(&state).unwrap();
		self.state = Some(state);
		self.write_state(s).map_err(|e| {
			wrap(
				e,
				format!("error saving launcher state into {}", self.path.display()),
			)
		})
	}

	fn write_state(&mut self, s: String) -> std::io::Result<()> {
		#[cfg(not(windows))]
		use std::os::unix::fs::OpenOptionsExt;

		let mut f = fs::OpenOptions::new();
		f.create(true);
		f.write(true);
		f.truncate(true);
		#[cfg(not(windows))]
		f.mode(self.mode);

		let mut f = f.open(&self.path)?;
		f.write_all(s.as_bytes())
	}
}

/// Container that holds some state value that is persisted to disk.
#[derive(Clone)]
pub struct PersistedState<T>
where
	T: Clone + Serialize + DeserializeOwned + Default,
{
	container: Arc<Mutex<PersistedStateContainer<T>>>,
}

impl<T> PersistedState<T>
where
	T: Clone + Serialize + DeserializeOwned + Default,
{
	/// Creates a new state container that persists to the given path.
	pub fn new(path: PathBuf) -> PersistedState<T> {
		Self::new_with_mode(path, 0o644)
	}

	/// Creates a new state container that persists to the given path.
	pub fn new_with_mode(path: PathBuf, mode: u32) -> PersistedState<T> {
		PersistedState {
			container: Arc::new(Mutex::new(PersistedStateContainer {
				path,
				state: None,
				mode,
			})),
		}
	}

	/// Loads persisted state.
	pub fn load(&self) -> T {
		self.container.lock().unwrap().load_or_get()
	}

	/// Saves persisted state.
	pub fn save(&self, state: T) -> Result<(), WrappedError> {
		self.container.lock().unwrap().save(state)
	}

	/// Mutates persisted state.
	pub fn update<R>(&self, mutator: impl FnOnce(&mut T) -> R) -> Result<R, WrappedError> {
		let mut container = self.container.lock().unwrap();
		let mut state = container.load_or_get();
		let r = mutator(&mut state);
		container.save(state).map(|_| r)
	}
}

impl LauncherPaths {
	/// todo@conno4312: temporary migration from the old CLI data directory
	pub fn migrate(root: Option<String>) -> Result<LauncherPaths, AnyError> {
		if root.is_some() {
			return Self::new(root);
		}

		let home_dir = match dirs::home_dir() {
			None => return Self::new(root),
			Some(d) => d,
		};

		let old_dir = home_dir.join(".vscode-cli");
		let mut new_dir = home_dir;
		new_dir.push(DEFAULT_DATA_PARENT_DIR);
		new_dir.push("cli");
		if !old_dir.exists() || new_dir.exists() {
			return Self::new_for_path(new_dir);
		}

		if let Err(e) = std::fs::rename(&old_dir, &new_dir) {
			// no logger exists at this point in the lifecycle, so just log to stderr
			eprintln!("Failed to migrate old CLI data directory, will create a new one ({e})");
		}

		Self::new_for_path(new_dir)
	}

	pub fn new(root: Option<String>) -> Result<LauncherPaths, AnyError> {
		let root = root.unwrap_or_else(|| format!("~/{DEFAULT_DATA_PARENT_DIR}/cli"));
		let mut replaced = root.to_owned();
		for token in HOME_DIR_ALTS {
			if root.contains(token) {
				if let Some(home) = dirs::home_dir() {
					replaced = root.replace(token, &home.to_string_lossy())
				} else {
					return Err(AnyError::from(NoHomeForLauncherError()));
				}
			}
		}

		Self::new_for_path(PathBuf::from(replaced))
	}

	fn new_for_path(root: PathBuf) -> Result<LauncherPaths, AnyError> {
		if !root.exists() {
			create_dir_all(&root)
				.map_err(|e| wrap(e, format!("error creating directory {}", root.display())))?;
		}

		Ok(LauncherPaths::new_without_replacements(root))
	}

	pub fn new_without_replacements(root: PathBuf) -> LauncherPaths {
		// cleanup folders that existed before the new LRU strategy:
		let _ = std::fs::remove_dir_all(root.join("server-insiders"));
		let _ = std::fs::remove_dir_all(root.join("server-stable"));

		LauncherPaths {
			server_cache: DownloadCache::new(root.join("servers")),
			cli_cache: DownloadCache::new(root.join("cli")),
			root,
		}
	}

	/// Root directory for the server launcher
	pub fn root(&self) -> &Path {
		&self.root
	}

	/// Lockfile for the running tunnel
	pub fn tunnel_lockfile(&self) -> PathBuf {
		self.root.join(format!(
			"tunnel-{}.lock",
			VSCODE_CLI_QUALITY.unwrap_or("oss")
		))
	}

	/// Lockfile for port forwarding
	pub fn forwarding_lockfile(&self) -> PathBuf {
		self.root.join(format!(
			"forwarding-{}.lock",
			VSCODE_CLI_QUALITY.unwrap_or("oss")
		))
	}

	/// Suggested path for tunnel service logs, when using file logs
	pub fn service_log_file(&self) -> PathBuf {
		self.root.join("tunnel-service.log")
	}

	/// Removes the launcher data directory.
	pub fn remove(&self) -> Result<(), WrappedError> {
		remove_dir_all(&self.root).map_err(|e| {
			wrap(
				e,
				format!(
					"error removing launcher data directory {}",
					self.root.display()
				),
			)
		})
	}

	/// Suggested path for web server storage
	pub fn web_server_storage(&self) -> PathBuf {
		self.root.join("serve-web")
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/tunnels.rs]---
Location: vscode-main/cli/src/tunnels.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

pub mod code_server;
pub mod dev_tunnels;
pub mod legal;
pub mod local_forwarding;
pub mod paths;
pub mod protocol;
pub mod shutdown_signal;
pub mod singleton_client;
pub mod singleton_server;

mod challenge;
mod control_server;
mod nosleep;
#[cfg(target_os = "linux")]
mod nosleep_linux;
#[cfg(target_os = "macos")]
mod nosleep_macos;
#[cfg(target_os = "windows")]
mod nosleep_windows;
mod port_forwarder;
mod server_bridge;
mod server_multiplexer;
mod service;
#[cfg(target_os = "linux")]
mod service_linux;
#[cfg(target_os = "macos")]
mod service_macos;
#[cfg(target_os = "windows")]
mod service_windows;
mod socket_signal;
mod wsl_detect;

pub use control_server::{serve, serve_stream, AuthRequired, Next, ServeStreamParams};
pub use nosleep::SleepInhibitor;
pub use service::{
	create_service_manager, ServiceContainer, ServiceManager, SERVICE_LOG_FILE_NAME,
};
```

--------------------------------------------------------------------------------

---[FILE: cli/src/update_service.rs]---
Location: vscode-main/cli/src/update_service.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use std::{fmt, path::Path};

use serde::{Deserialize, Serialize};

use crate::{
	constants::VSCODE_CLI_UPDATE_ENDPOINT,
	debug, log, options, spanf,
	util::{
		errors::{wrap, AnyError, CodeError, WrappedError},
		http::{BoxedHttp, SimpleResponse},
		io::ReportCopyProgress,
		tar::{self, has_gzip_header},
		zipper,
	},
};

/// Implementation of the VS Code Update service for use in the CLI.
#[derive(Clone)]
pub struct UpdateService {
	client: BoxedHttp,
	log: log::Logger,
}

/// Describes a specific release, can be created manually or returned from the update service.
#[derive(Clone, Eq, PartialEq)]
pub struct Release {
	pub name: String,
	pub platform: Platform,
	pub target: TargetKind,
	pub quality: options::Quality,
	pub commit: String,
}

impl std::fmt::Display for Release {
	fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
		write!(f, "{} (commit {})", self.name, self.commit)
	}
}

#[derive(Deserialize)]
struct UpdateServerVersion {
	pub version: String,
	pub name: String,
}

fn quality_download_segment(quality: options::Quality) -> &'static str {
	match quality {
		options::Quality::Stable => "stable",
		options::Quality::Insiders => "insider",
		options::Quality::Exploration => "exploration",
	}
}

fn get_update_endpoint() -> Result<String, CodeError> {
	if let Ok(url) = std::env::var("VSCODE_CLI_UPDATE_URL") {
		if !url.is_empty() {
			return Ok(url);
		}
	}
	VSCODE_CLI_UPDATE_ENDPOINT
		.map(|s| s.to_string())
		.ok_or_else(|| CodeError::UpdatesNotConfigured("no service url"))
}

impl UpdateService {
	pub fn new(log: log::Logger, http: BoxedHttp) -> Self {
		UpdateService { client: http, log }
	}

	pub async fn get_release_by_semver_version(
		&self,
		platform: Platform,
		target: TargetKind,
		quality: options::Quality,
		version: &str,
	) -> Result<Release, AnyError> {
		let update_endpoint = get_update_endpoint()?;
		let download_segment = target
			.download_segment(platform)
			.ok_or_else(|| CodeError::UnsupportedPlatform(platform.to_string()))?;
		let download_url = format!(
			"{}/api/versions/{}/{}/{}",
			&update_endpoint,
			version,
			download_segment,
			quality_download_segment(quality),
		);

		let mut response = spanf!(
			self.log,
			self.log.span("server.version.resolve"),
			self.client.make_request("GET", download_url)
		)?;

		if !response.status_code.is_success() {
			return Err(response.into_err().await.into());
		}

		let res = response.json::<UpdateServerVersion>().await?;
		debug!(self.log, "Resolved version {} to {}", version, res.version);

		Ok(Release {
			target,
			platform,
			quality,
			name: res.name,
			commit: res.version,
		})
	}

	/// Gets the latest commit for the target of the given quality.
	pub async fn get_latest_commit(
		&self,
		platform: Platform,
		target: TargetKind,
		quality: options::Quality,
	) -> Result<Release, AnyError> {
		let update_endpoint = get_update_endpoint()?;
		let download_segment = target
			.download_segment(platform)
			.ok_or_else(|| CodeError::UnsupportedPlatform(platform.to_string()))?;
		let download_url = format!(
			"{}/api/latest/{}/{}",
			&update_endpoint,
			download_segment,
			quality_download_segment(quality),
		);

		let mut response = spanf!(
			self.log,
			self.log.span("server.version.resolve"),
			self.client.make_request("GET", download_url)
		)?;

		if !response.status_code.is_success() {
			return Err(response.into_err().await.into());
		}

		let res = response.json::<UpdateServerVersion>().await?;
		debug!(self.log, "Resolved quality {} to {}", quality, res.version);

		Ok(Release {
			target,
			platform,
			quality,
			name: res.name,
			commit: res.version,
		})
	}

	/// Gets the download stream for the release.
	pub async fn get_download_stream(&self, release: &Release) -> Result<SimpleResponse, AnyError> {
		let update_endpoint = get_update_endpoint()?;
		let download_segment = release
			.target
			.download_segment(release.platform)
			.ok_or_else(|| CodeError::UnsupportedPlatform(release.platform.to_string()))?;

		let download_url = format!(
			"{}/commit:{}/{}/{}",
			&update_endpoint,
			release.commit,
			download_segment,
			quality_download_segment(release.quality),
		);

		let response = self.client.make_request("GET", download_url).await?;
		if !response.status_code.is_success() {
			return Err(response.into_err().await.into());
		}

		Ok(response)
	}
}

pub fn unzip_downloaded_release<T>(
	compressed_file: &Path,
	target_dir: &Path,
	reporter: T,
) -> Result<(), WrappedError>
where
	T: ReportCopyProgress,
{
	match has_gzip_header(compressed_file) {
		Ok((f, true)) => tar::decompress_tarball(f, target_dir, reporter),
		Ok((f, false)) => zipper::unzip_file(f, target_dir, reporter),
		Err(e) => Err(wrap(e, "error checking for gzip header")),
	}
}

#[derive(Eq, PartialEq, Copy, Clone)]
pub enum TargetKind {
	Server,
	Archive,
	Web,
	Cli,
}

impl TargetKind {
	fn download_segment(&self, platform: Platform) -> Option<String> {
		match *self {
			TargetKind::Server => Some(platform.headless()),
			TargetKind::Archive => platform.archive(),
			TargetKind::Web => Some(platform.web()),
			TargetKind::Cli => Some(platform.cli()),
		}
	}
}

#[derive(Debug, Copy, Clone, Eq, PartialEq, Serialize, Deserialize)]
pub enum Platform {
	LinuxAlpineX64,
	LinuxAlpineARM64,
	LinuxX64,
	LinuxX64Legacy,
	LinuxARM64,
	LinuxARM64Legacy,
	LinuxARM32,
	LinuxARM32Legacy,
	DarwinX64,
	DarwinARM64,
	WindowsX64,
	WindowsX86,
	WindowsARM64,
}

impl Platform {
	pub fn archive(&self) -> Option<String> {
		match self {
			Platform::LinuxX64 => Some("linux-x64".to_owned()),
			Platform::LinuxARM64 => Some("linux-arm64".to_owned()),
			Platform::LinuxARM32 => Some("linux-armhf".to_owned()),
			Platform::DarwinX64 => Some("darwin".to_owned()),
			Platform::DarwinARM64 => Some("darwin-arm64".to_owned()),
			Platform::WindowsX64 => Some("win32-x64-archive".to_owned()),
			Platform::WindowsX86 => Some("win32-archive".to_owned()),
			Platform::WindowsARM64 => Some("win32-arm64-archive".to_owned()),
			_ => None,
		}
	}
	pub fn headless(&self) -> String {
		match self {
			Platform::LinuxAlpineARM64 => "server-alpine-arm64",
			Platform::LinuxAlpineX64 => "server-linux-alpine",
			Platform::LinuxX64 => "server-linux-x64",
			Platform::LinuxX64Legacy => "server-linux-legacy-x64",
			Platform::LinuxARM64 => "server-linux-arm64",
			Platform::LinuxARM64Legacy => "server-linux-legacy-arm64",
			Platform::LinuxARM32 => "server-linux-armhf",
			Platform::LinuxARM32Legacy => "server-linux-legacy-armhf",
			Platform::DarwinX64 => "server-darwin",
			Platform::DarwinARM64 => "server-darwin-arm64",
			Platform::WindowsX64 => "server-win32-x64",
			Platform::WindowsX86 => "server-win32",
			Platform::WindowsARM64 => "server-win32-arm64",
		}
		.to_owned()
	}

	pub fn cli(&self) -> String {
		match self {
			Platform::LinuxAlpineARM64 => "cli-alpine-arm64",
			Platform::LinuxAlpineX64 => "cli-alpine-x64",
			Platform::LinuxX64 => "cli-linux-x64",
			Platform::LinuxX64Legacy => "cli-linux-x64",
			Platform::LinuxARM64 => "cli-linux-arm64",
			Platform::LinuxARM64Legacy => "cli-linux-arm64",
			Platform::LinuxARM32 => "cli-linux-armhf",
			Platform::LinuxARM32Legacy => "cli-linux-armhf",
			Platform::DarwinX64 => "cli-darwin-x64",
			Platform::DarwinARM64 => "cli-darwin-arm64",
			Platform::WindowsARM64 => "cli-win32-arm64",
			Platform::WindowsX64 => "cli-win32-x64",
			Platform::WindowsX86 => "cli-win32",
		}
		.to_owned()
	}

	pub fn web(&self) -> String {
		format!("{}-web", self.headless())
	}

	pub fn env_default() -> Option<Platform> {
		if cfg!(all(
			target_os = "linux",
			target_arch = "x86_64",
			target_env = "musl"
		)) {
			Some(Platform::LinuxAlpineX64)
		} else if cfg!(all(
			target_os = "linux",
			target_arch = "aarch64",
			target_env = "musl"
		)) {
			Some(Platform::LinuxAlpineARM64)
		} else if cfg!(all(target_os = "linux", target_arch = "x86_64")) {
			Some(Platform::LinuxX64)
		} else if cfg!(all(target_os = "linux", target_arch = "arm")) {
			Some(Platform::LinuxARM32)
		} else if cfg!(all(target_os = "linux", target_arch = "aarch64")) {
			Some(Platform::LinuxARM64)
		} else if cfg!(all(target_os = "macos", target_arch = "x86_64")) {
			Some(Platform::DarwinX64)
		} else if cfg!(all(target_os = "macos", target_arch = "aarch64")) {
			Some(Platform::DarwinARM64)
		} else if cfg!(all(target_os = "windows", target_arch = "x86_64")) {
			Some(Platform::WindowsX64)
		} else if cfg!(all(target_os = "windows", target_arch = "x86")) {
			Some(Platform::WindowsX86)
		} else if cfg!(all(target_os = "windows", target_arch = "aarch64")) {
			Some(Platform::WindowsARM64)
		} else {
			None
		}
	}
}

impl fmt::Display for Platform {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		f.write_str(match self {
			Platform::LinuxAlpineARM64 => "LinuxAlpineARM64",
			Platform::LinuxAlpineX64 => "LinuxAlpineX64",
			Platform::LinuxX64 => "LinuxX64",
			Platform::LinuxX64Legacy => "LinuxX64Legacy",
			Platform::LinuxARM64 => "LinuxARM64",
			Platform::LinuxARM64Legacy => "LinuxARM64Legacy",
			Platform::LinuxARM32 => "LinuxARM32",
			Platform::LinuxARM32Legacy => "LinuxARM32Legacy",
			Platform::DarwinX64 => "DarwinX64",
			Platform::DarwinARM64 => "DarwinARM64",
			Platform::WindowsX64 => "WindowsX64",
			Platform::WindowsX86 => "WindowsX86",
			Platform::WindowsARM64 => "WindowsARM64",
		})
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/util.rs]---
Location: vscode-main/cli/src/util.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

mod is_integrated;

pub mod command;
pub mod errors;
pub mod http;
pub mod input;
pub mod io;
pub mod machine;
pub mod prereqs;
pub mod ring_buffer;
pub mod sync;
pub use is_integrated::*;
pub mod app_lock;
pub mod file_lock;
pub mod os;
pub mod tar;
pub mod zipper;
```

--------------------------------------------------------------------------------

---[FILE: cli/src/bin/code/legacy_args.rs]---
Location: vscode-main/cli/src/bin/code/legacy_args.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use std::collections::HashMap;

use cli::commands::args::{
	CliCore, Commands, DesktopCodeOptions, ExtensionArgs, ExtensionSubcommand,
	InstallExtensionArgs, ListExtensionArgs, UninstallExtensionArgs,
};

/// Tries to parse the argv using the legacy CLI interface, looking for its
/// flags and generating a CLI with subcommands if those don't exist.
pub fn try_parse_legacy(
	iter: impl IntoIterator<Item = impl Into<std::ffi::OsString>>,
) -> Option<CliCore> {
	let raw = clap_lex::RawArgs::new(iter);
	let mut cursor = raw.cursor();
	raw.next(&mut cursor); // Skip the bin

	// First make a hashmap of all flags and capture positional arguments.
	let mut args: HashMap<String, Vec<String>> = HashMap::new();
	let mut last_arg = None;
	while let Some(arg) = raw.next(&mut cursor) {
		if let Some((long, value)) = arg.to_long() {
			if let Ok(long) = long {
				last_arg = Some(long.to_string());
				match args.get_mut(long) {
					Some(prev) => {
						if let Some(v) = value {
							prev.push(v.to_string_lossy().to_string());
						}
					}
					None => {
						if let Some(v) = value {
							args.insert(long.to_string(), vec![v.to_string_lossy().to_string()]);
						} else {
							args.insert(long.to_string(), vec![]);
						}
					}
				}
			}
		} else if let Ok(value) = arg.to_value() {
			if value == "tunnel" {
				return None;
			}
			if let Some(last_arg) = &last_arg {
				args.get_mut(last_arg)
					.expect("expected to have last arg")
					.push(value.to_string());
			}
		}
	}

	let get_first_arg_value =
		|key: &str| args.get(key).and_then(|v| v.first()).map(|s| s.to_string());
	let desktop_code_options = DesktopCodeOptions {
		extensions_dir: get_first_arg_value("extensions-dir"),
		user_data_dir: get_first_arg_value("user-data-dir"),
		use_version: None,
	};

	// Now translate them to subcommands.
	// --list-extensions        -> ext list
	// --update-extensions      -> update
	// --install-extension=id   -> ext install <id>
	// --uninstall-extension=id -> ext uninstall <id>
	// --status                 -> status

	if args.contains_key("list-extensions") {
		Some(CliCore {
			subcommand: Some(Commands::Extension(ExtensionArgs {
				subcommand: ExtensionSubcommand::List(ListExtensionArgs {
					category: get_first_arg_value("category"),
					show_versions: args.contains_key("show-versions"),
				}),
				desktop_code_options,
			})),
			..Default::default()
		})
	} else if let Some(exts) = args.remove("install-extension") {
		Some(CliCore {
			subcommand: Some(Commands::Extension(ExtensionArgs {
				subcommand: ExtensionSubcommand::Install(InstallExtensionArgs {
					id_or_path: exts,
					pre_release: args.contains_key("pre-release"),
					donot_include_pack_and_dependencies: args
						.contains_key("do-not-include-pack-dependencies"),
					force: args.contains_key("force"),
				}),
				desktop_code_options,
			})),
			..Default::default()
		})
	} else if let Some(_exts) = args.remove("update-extensions") {
		Some(CliCore {
			subcommand: Some(Commands::Extension(ExtensionArgs {
				subcommand: ExtensionSubcommand::Update,
				desktop_code_options,
			})),
			..Default::default()
		})
	} else if let Some(exts) = args.remove("uninstall-extension") {
		Some(CliCore {
			subcommand: Some(Commands::Extension(ExtensionArgs {
				subcommand: ExtensionSubcommand::Uninstall(UninstallExtensionArgs { id: exts }),
				desktop_code_options,
			})),
			..Default::default()
		})
	} else if args.contains_key("status") {
		Some(CliCore {
			subcommand: Some(Commands::Status),
			..Default::default()
		})
	} else {
		None
	}
}

#[cfg(test)]
mod tests {
	use super::*;

	#[test]
	fn test_parses_list_extensions() {
		let args = vec![
			"code",
			"--list-extensions",
			"--category",
			"themes",
			"--show-versions",
		];
		let cli = try_parse_legacy(args).unwrap();

		if let Some(Commands::Extension(extension_args)) = cli.subcommand {
			if let ExtensionSubcommand::List(list_args) = extension_args.subcommand {
				assert_eq!(list_args.category, Some("themes".to_string()));
				assert!(list_args.show_versions);
			} else {
				panic!(
					"Expected list subcommand, got {:?}",
					extension_args.subcommand
				);
			}
		} else {
			panic!("Expected extension subcommand, got {:?}", cli.subcommand);
		}
	}

	#[test]
	fn test_parses_install_extension() {
		let args = vec![
			"code",
			"--install-extension",
			"connor4312.codesong",
			"connor4312.hello-world",
			"--pre-release",
			"--force",
		];
		let cli = try_parse_legacy(args).unwrap();

		if let Some(Commands::Extension(extension_args)) = cli.subcommand {
			if let ExtensionSubcommand::Install(install_args) = extension_args.subcommand {
				assert_eq!(
					install_args.id_or_path,
					vec!["connor4312.codesong", "connor4312.hello-world"]
				);
				assert!(install_args.pre_release);
				assert!(install_args.force);
			} else {
				panic!(
					"Expected install subcommand, got {:?}",
					extension_args.subcommand
				);
			}
		} else {
			panic!("Expected extension subcommand, got {:?}", cli.subcommand);
		}
	}

	#[test]
	fn test_parses_uninstall_extension() {
		let args = vec!["code", "--uninstall-extension", "connor4312.codesong"];
		let cli = try_parse_legacy(args).unwrap();

		if let Some(Commands::Extension(extension_args)) = cli.subcommand {
			if let ExtensionSubcommand::Uninstall(uninstall_args) = extension_args.subcommand {
				assert_eq!(uninstall_args.id, vec!["connor4312.codesong"]);
			} else {
				panic!(
					"Expected uninstall subcommand, got {:?}",
					extension_args.subcommand
				);
			}
		} else {
			panic!("Expected extension subcommand, got {:?}", cli.subcommand);
		}
	}

	#[test]
	fn test_parses_user_data_dir_and_extensions_dir() {
		let args = vec![
			"code",
			"--uninstall-extension",
			"connor4312.codesong",
			"--user-data-dir",
			"foo",
			"--extensions-dir",
			"bar",
		];
		let cli = try_parse_legacy(args).unwrap();

		if let Some(Commands::Extension(extension_args)) = cli.subcommand {
			assert_eq!(
				extension_args.desktop_code_options.user_data_dir,
				Some("foo".to_string())
			);
			assert_eq!(
				extension_args.desktop_code_options.extensions_dir,
				Some("bar".to_string())
			);
			if let ExtensionSubcommand::Uninstall(uninstall_args) = extension_args.subcommand {
				assert_eq!(uninstall_args.id, vec!["connor4312.codesong"]);
			} else {
				panic!(
					"Expected uninstall subcommand, got {:?}",
					extension_args.subcommand
				);
			}
		} else {
			panic!("Expected extension subcommand, got {:?}", cli.subcommand);
		}
	}

	#[test]
	fn test_status() {
		let args = vec!["code", "--status"];
		let cli = try_parse_legacy(args).unwrap();

		if let Some(Commands::Status) = cli.subcommand {
			// no-op
		} else {
			panic!("Expected extension subcommand, got {:?}", cli.subcommand);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/bin/code/main.rs]---
Location: vscode-main/cli/src/bin/code/main.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
mod legacy_args;

use std::process::Command;

use clap::Parser;
use cli::{
	commands::{args, serve_web, tunnels, update, version, CommandContext},
	constants::get_default_user_agent,
	desktop, log,
	state::LauncherPaths,
	util::{
		errors::{wrap, AnyError},
		is_integrated_cli,
		prereqs::PreReqChecker,
	},
};
use legacy_args::try_parse_legacy;
use opentelemetry::sdk::trace::TracerProvider as SdkTracerProvider;
use opentelemetry::trace::TracerProvider;

#[tokio::main]
async fn main() -> Result<(), std::convert::Infallible> {
	let raw_args = std::env::args_os().collect::<Vec<_>>();
	let parsed = try_parse_legacy(&raw_args)
		.map(|core| args::AnyCli::Integrated(args::IntegratedCli { core }))
		.unwrap_or_else(|| {
			if let Ok(true) = is_integrated_cli() {
				args::AnyCli::Integrated(args::IntegratedCli::parse_from(&raw_args))
			} else {
				args::AnyCli::Standalone(args::StandaloneCli::parse_from(&raw_args))
			}
		});

	let core = parsed.core();
	let context_paths = LauncherPaths::migrate(core.global_options.cli_data_dir.clone()).unwrap();
	let context_args = core.clone();

	// gets a command context without installing the global logger
	let context_no_logger = || CommandContext {
		http: reqwest::ClientBuilder::new()
			.user_agent(get_default_user_agent())
			.build()
			.unwrap(),
		paths: context_paths,
		log: make_logger(&context_args),
		args: context_args,
	};

	// gets a command context with the global logger installer. Usually what most commands want.
	macro_rules! context {
		() => {{
			let context = context_no_logger();
			log::install_global_logger(context.log.clone());
			context
		}};
	}

	let result = match parsed {
		args::AnyCli::Standalone(args::StandaloneCli {
			subcommand: Some(cmd),
			..
		}) => match cmd {
			args::StandaloneCommands::Update(args) => update::update(context!(), args).await,
		},
		args::AnyCli::Standalone(args::StandaloneCli { core: c, .. })
		| args::AnyCli::Integrated(args::IntegratedCli { core: c, .. }) => match c.subcommand {
			None => {
				let context = context!();
				let ca = context.args.get_base_code_args();
				start_code(context, ca).await
			}

			Some(args::Commands::Extension(extension_args)) => {
				let context = context!();
				let mut ca = context.args.get_base_code_args();
				extension_args.add_code_args(&mut ca);
				start_code(context, ca).await
			}

			Some(args::Commands::Status) => {
				let context = context!();
				let mut ca = context.args.get_base_code_args();
				ca.push("--status".to_string());
				start_code(context, ca).await
			}

			Some(args::Commands::Version(version_args)) => match version_args.subcommand {
				args::VersionSubcommand::Use(use_version_args) => {
					version::switch_to(context!(), use_version_args).await
				}
				args::VersionSubcommand::Show => version::show(context!()).await,
			},

			Some(args::Commands::CommandShell(cs_args)) => {
				tunnels::command_shell(context!(), cs_args).await
			}

			Some(args::Commands::ServeWeb(sw_args)) => {
				serve_web::serve_web(context!(), sw_args).await
			}

			Some(args::Commands::Tunnel(mut tunnel_args)) => match tunnel_args.subcommand.take() {
				Some(args::TunnelSubcommand::Prune) => tunnels::prune(context!()).await,
				Some(args::TunnelSubcommand::Unregister) => tunnels::unregister(context!()).await,
				Some(args::TunnelSubcommand::Kill) => tunnels::kill(context!()).await,
				Some(args::TunnelSubcommand::Restart) => tunnels::restart(context!()).await,
				Some(args::TunnelSubcommand::Status) => tunnels::status(context!()).await,
				Some(args::TunnelSubcommand::Rename(rename_args)) => {
					tunnels::rename(context!(), rename_args).await
				}
				Some(args::TunnelSubcommand::User(user_command)) => {
					tunnels::user(context!(), user_command).await
				}
				Some(args::TunnelSubcommand::Service(service_args)) => {
					tunnels::service(context_no_logger(), tunnel_args, service_args).await
				}
				Some(args::TunnelSubcommand::ForwardInternal(forward_args)) => {
					tunnels::forward(context_no_logger(), forward_args).await
				}
				None => tunnels::serve(context_no_logger(), tunnel_args.serve_args).await,
			},
		},
	};

	match result {
		Err(e) => print_and_exit(e),
		Ok(code) => std::process::exit(code),
	}
}

fn make_logger(core: &args::CliCore) -> log::Logger {
	let log_level = if core.global_options.verbose {
		log::Level::Trace
	} else {
		core.global_options.log.unwrap_or(log::Level::Info)
	};

	let tracer = SdkTracerProvider::builder().build().tracer("codecli");
	let mut log = log::Logger::new(tracer, log_level);
	if let Some(f) = &core.global_options.log_to_file {
		log = log
			.with_sink(log::FileLogSink::new(log_level, f).expect("expected to make file logger"))
	}

	log
}

fn print_and_exit<E>(err: E) -> !
where
	E: std::fmt::Display,
{
	log::emit(log::Level::Error, "", &format!("{err}"));
	std::process::exit(1);
}

async fn start_code(context: CommandContext, args: Vec<String>) -> Result<i32, AnyError> {
	// todo: once the integrated CLI takes the place of the Node.js CLI, this should
	// redirect to the current installation without using the CodeVersionManager.

	let platform = PreReqChecker::new().verify().await?;
	let version_manager =
		desktop::CodeVersionManager::new(context.log.clone(), &context.paths, platform);
	let version = match &context.args.editor_options.code_options.use_version {
		Some(v) => desktop::RequestedVersion::try_from(v.as_str())?,
		None => version_manager.get_preferred_version(),
	};

	let binary = match version_manager.try_get_entrypoint(&version).await {
		Some(ep) => ep,
		None => {
			desktop::prompt_to_install(&version);
			return Ok(1);
		}
	};

	let code = Command::new(&binary)
		.args(args)
		.status()
		.map(|s| s.code().unwrap_or(1))
		.map_err(|e| wrap(e, format!("error running editor from {}", binary.display())))?;

	Ok(code)
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/commands/args.rs]---
Location: vscode-main/cli/src/commands/args.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use std::{fmt, path::PathBuf};

use crate::{constants, log, options, tunnels::code_server::CodeServerArgs};
use clap::{Args, Parser, Subcommand, ValueEnum};
use const_format::concatcp;

const CLI_NAME: &str = concatcp!(constants::PRODUCT_NAME_LONG, " CLI");
const HELP_COMMANDS: &str = concatcp!(
	"Usage: ",
	constants::APPLICATION_NAME,
	" [options][paths...]

To read output from another program, append '-' (e.g. 'echo Hello World | {name} -')"
);

const STANDALONE_TEMPLATE: &str = concatcp!(
	CLI_NAME,
	" Standalone - {version}

",
	HELP_COMMANDS,
	"
Running editor commands requires installing ",
	constants::QUALITYLESS_PRODUCT_NAME,
	", and may differ slightly.

{all-args}"
);
const INTEGRATED_TEMPLATE: &str = concatcp!(
	CLI_NAME,
	" - {version}

",
	HELP_COMMANDS,
	"

{all-args}"
);

const COMMIT_IN_VERSION: &str = match constants::VSCODE_CLI_COMMIT {
	Some(c) => c,
	None => "unknown",
};
const NUMBER_IN_VERSION: &str = match constants::VSCODE_CLI_VERSION {
	Some(c) => c,
	None => "dev",
};
const VERSION: &str = concatcp!(NUMBER_IN_VERSION, " (commit ", COMMIT_IN_VERSION, ")");

#[derive(Parser, Debug, Default)]
#[clap(
   help_template = INTEGRATED_TEMPLATE,
   long_about = None,
	 name = constants::APPLICATION_NAME,
   version = VERSION,
 )]
pub struct IntegratedCli {
	#[clap(flatten)]
	pub core: CliCore,
}

/// Common CLI shared between integrated and standalone interfaces.
#[derive(Args, Debug, Default, Clone)]
pub struct CliCore {
	/// One or more files, folders, or URIs to open.
	#[clap(name = "paths")]
	pub open_paths: Vec<String>,

	#[clap(flatten, next_help_heading = Some("EDITOR OPTIONS"))]
	pub editor_options: EditorOptions,

	#[clap(flatten, next_help_heading = Some("EDITOR TROUBLESHOOTING"))]
	pub troubleshooting: EditorTroubleshooting,

	#[clap(flatten, next_help_heading = Some("GLOBAL OPTIONS"))]
	pub global_options: GlobalOptions,

	#[clap(subcommand)]
	pub subcommand: Option<Commands>,
}

#[derive(Parser, Debug, Default)]
#[clap(
   help_template = STANDALONE_TEMPLATE,
   long_about = None,
   version = VERSION,
	 name = constants::APPLICATION_NAME,
 )]
pub struct StandaloneCli {
	#[clap(flatten)]
	pub core: CliCore,

	#[clap(subcommand)]
	pub subcommand: Option<StandaloneCommands>,
}

pub enum AnyCli {
	Integrated(IntegratedCli),
	Standalone(StandaloneCli),
}

impl AnyCli {
	pub fn core(&self) -> &CliCore {
		match self {
			AnyCli::Integrated(cli) => &cli.core,
			AnyCli::Standalone(cli) => &cli.core,
		}
	}
}

impl CliCore {
	pub fn get_base_code_args(&self) -> Vec<String> {
		let mut args = self.open_paths.clone();
		self.editor_options.add_code_args(&mut args);
		self.troubleshooting.add_code_args(&mut args);
		self.global_options.add_code_args(&mut args);
		args
	}
}

impl<'a> From<&'a CliCore> for CodeServerArgs {
	fn from(cli: &'a CliCore) -> Self {
		let mut args = CodeServerArgs {
			log: cli.global_options.log,
			accept_server_license_terms: true,
			..Default::default()
		};

		args.log = cli.global_options.log;
		args.accept_server_license_terms = true;

		if cli.global_options.verbose {
			args.verbose = true;
		}

		if cli.global_options.disable_telemetry {
			args.telemetry_level = Some(options::TelemetryLevel::Off);
		} else if cli.global_options.telemetry_level.is_some() {
			args.telemetry_level = cli.global_options.telemetry_level;
		}

		args
	}
}

#[derive(Subcommand, Debug, Clone)]
pub enum StandaloneCommands {
	/// Updates the CLI.
	Update(StandaloneUpdateArgs),
}

#[derive(Args, Debug, Clone)]
pub struct StandaloneUpdateArgs {
	/// Only check for updates, without actually updating the CLI.
	#[clap(long)]
	pub check: bool,
}

#[derive(Subcommand, Debug, Clone)]

pub enum Commands {
	/// Create a tunnel that's accessible on vscode.dev from anywhere.
	/// Run `code tunnel --help` for more usage info.
	Tunnel(TunnelArgs),

	/// Manage editor extensions.
	#[clap(name = "ext")]
	Extension(ExtensionArgs),

	/// Print process usage and diagnostics information.
	Status,

	/// Changes the version of the editor you're using.
	Version(VersionArgs),

	/// Runs a local web version of VS Code.
	#[clap(about = concatcp!("Runs a local web version of ", constants::PRODUCT_NAME_LONG))]
	ServeWeb(ServeWebArgs),

	/// Runs the control server on process stdin/stdout
	#[clap(hide = true)]
	CommandShell(CommandShellArgs),
}

#[derive(Args, Debug, Clone)]
pub struct ServeWebArgs {
	/// Host to listen on, defaults to 'localhost'
	#[clap(long)]
	pub host: Option<String>,
	// The path to a socket file for the server to listen to.
	#[clap(long)]
	pub socket_path: Option<String>,
	/// Port to listen on. If 0 is passed a random free port is picked.
	#[clap(long, default_value_t = 8000)]
	pub port: u16,
	/// A secret that must be included with all requests.
	#[clap(long)]
	pub connection_token: Option<String>,
	/// A file containing a secret that must be included with all requests.
	#[clap(long)]
	pub connection_token_file: Option<String>,
	/// Run without a connection token. Only use this if the connection is secured by other means.
	#[clap(long)]
	pub without_connection_token: bool,
	/// If set, the user accepts the server license terms and the server will be started without a user prompt.
	#[clap(long)]
	pub accept_server_license_terms: bool,
	/// Specifies the path under which the web UI and the code server is provided.
	#[clap(long)]
	pub server_base_path: Option<String>,
	/// Specifies the directory that server data is kept in.
	#[clap(long)]
	pub server_data_dir: Option<String>,
	/// Use a specific commit SHA for the client.
	#[clap(long)]
	pub commit_id: Option<String>,
}

#[derive(Args, Debug, Clone)]
pub struct CommandShellArgs {
	#[clap(flatten)]
	pub server_args: BaseServerArgs,

	/// Listen on a socket instead of stdin/stdout.
	#[clap(long)]
	pub on_socket: bool,
	/// Listen on a host/port instead of stdin/stdout.
	#[clap(long, num_args = 0..=2, default_missing_value = "0")]
	pub on_port: Vec<u16>,
	/// Listen on a host/port instead of stdin/stdout.
	#[clap[long]]
	pub on_host: Option<String>,
	/// Require the given token string to be given in the handshake.
	#[clap(long, env = "VSCODE_CLI_REQUIRE_TOKEN")]
	pub require_token: Option<String>,
	/// Optional parent process id. If provided, the server will be stopped when the process of the given pid no longer exists
	#[clap(long, hide = true)]
	pub parent_process_id: Option<String>,
}

#[derive(Args, Debug, Clone)]
pub struct ExtensionArgs {
	#[clap(subcommand)]
	pub subcommand: ExtensionSubcommand,

	#[clap(flatten)]
	pub desktop_code_options: DesktopCodeOptions,
}

impl ExtensionArgs {
	pub fn add_code_args(&self, target: &mut Vec<String>) {
		self.desktop_code_options.add_code_args(target);
		self.subcommand.add_code_args(target);
	}
}

#[derive(Subcommand, Debug, Clone)]
pub enum ExtensionSubcommand {
	/// List installed extensions.
	List(ListExtensionArgs),
	/// Install an extension.
	Install(InstallExtensionArgs),
	/// Uninstall an extension.
	Uninstall(UninstallExtensionArgs),
	/// Update the installed extensions.
	Update,
}

impl ExtensionSubcommand {
	pub fn add_code_args(&self, target: &mut Vec<String>) {
		match self {
			ExtensionSubcommand::List(args) => {
				target.push("--list-extensions".to_string());
				if args.show_versions {
					target.push("--show-versions".to_string());
				}
				if let Some(category) = &args.category {
					target.push(format!("--category={category}"));
				}
			}
			ExtensionSubcommand::Install(args) => {
				for id in args.id_or_path.iter() {
					target.push(format!("--install-extension={id}"));
				}
				if args.pre_release {
					target.push("--pre-release".to_string());
				}
				if args.donot_include_pack_and_dependencies {
					target.push("do-not-include-pack-dependencies".to_string());
				}
				if args.force {
					target.push("--force".to_string());
				}
			}
			ExtensionSubcommand::Uninstall(args) => {
				for id in args.id.iter() {
					target.push(format!("--uninstall-extension={id}"));
				}
			}
			ExtensionSubcommand::Update => {
				target.push("--update-extensions".to_string());
			}
		}
	}
}

#[derive(Args, Debug, Clone)]
pub struct ListExtensionArgs {
	/// Filters installed extensions by provided category, when using --list-extensions.
	#[clap(long, value_name = "category")]
	pub category: Option<String>,

	/// Show versions of installed extensions, when using --list-extensions.
	#[clap(long)]
	pub show_versions: bool,
}

#[derive(Args, Debug, Clone)]
pub struct InstallExtensionArgs {
	/// Either an extension id or a path to a VSIX. The identifier of an
	/// extension is '${publisher}.${name}'. Use '--force' argument to update
	/// to latest version. To install a specific version provide '@${version}'.
	/// For example: 'vscode.csharp@1.2.3'.
	#[clap(name = "ext-id | id")]
	pub id_or_path: Vec<String>,

	/// Installs the pre-release version of the extension
	#[clap(long)]
	pub pre_release: bool,

	/// Don't include installing pack and dependencies of the extension
	#[clap(long)]
	pub donot_include_pack_and_dependencies: bool,

	/// Update to the latest version of the extension if it's already installed.
	#[clap(long)]
	pub force: bool,
}

#[derive(Args, Debug, Clone)]
pub struct UninstallExtensionArgs {
	/// One or more extension identifiers to uninstall. The identifier of an
	/// extension is '${publisher}.${name}'. Use '--force' argument to update
	/// to latest version.
	#[clap(name = "ext-id")]
	pub id: Vec<String>,
}

#[derive(Args, Debug, Clone)]
pub struct VersionArgs {
	#[clap(subcommand)]
	pub subcommand: VersionSubcommand,
}

#[derive(Subcommand, Debug, Clone)]
pub enum VersionSubcommand {
	/// Switches the version of the editor in use.
	Use(UseVersionArgs),

	/// Shows the currently configured editor version.
	Show,
}

#[derive(Args, Debug, Clone)]
pub struct UseVersionArgs {
	/// The version of the editor you want to use. Can be "stable", "insiders",
	/// or an absolute path to an existing install.
	#[clap(value_name = "stable | insiders | x.y.z | path")]
	pub name: String,

	/// The directory where the version can be found.
	#[clap(long, value_name = "path")]
	pub install_dir: Option<String>,
}

#[derive(Args, Debug, Default, Clone)]
pub struct EditorOptions {
	/// Compare two files with each other.
	#[clap(short, long, value_names = &["file", "file"])]
	pub diff: Vec<String>,

	/// Add folder(s) to the last active window.
	#[clap(short, long, value_name = "folder")]
	pub add: Option<String>,

	/// Open a file at the path on the specified line and character position.
	#[clap(short, long, value_name = "file:line[:character]")]
	pub goto: Option<String>,

	/// Force to open a new window.
	#[clap(short, long)]
	pub new_window: bool,

	/// Force to open a file or folder in an
	#[clap(short, long)]
	pub reuse_window: bool,

	/// Wait for the files to be closed before returning.
	#[clap(short, long)]
	pub wait: bool,

	/// The locale to use (e.g. en-US or zh-TW).
	#[clap(long, value_name = "locale")]
	pub locale: Option<String>,

	/// Enables proposed API features for extensions. Can receive one or
	/// more extension IDs to enable individually.
	#[clap(long, value_name = "ext-id")]
	pub enable_proposed_api: Vec<String>,

	#[clap(flatten)]
	pub code_options: DesktopCodeOptions,
}

impl EditorOptions {
	pub fn add_code_args(&self, target: &mut Vec<String>) {
		if !self.diff.is_empty() {
			target.push("--diff".to_string());
			for file in self.diff.iter() {
				target.push(file.clone());
			}
		}
		if let Some(add) = &self.add {
			target.push("--add".to_string());
			target.push(add.clone());
		}
		if let Some(goto) = &self.goto {
			target.push("--goto".to_string());
			target.push(goto.clone());
		}
		if self.new_window {
			target.push("--new-window".to_string());
		}
		if self.reuse_window {
			target.push("--reuse-window".to_string());
		}
		if self.wait {
			target.push("--wait".to_string());
		}
		if let Some(locale) = &self.locale {
			target.push(format!("--locale={locale}"));
		}
		if !self.enable_proposed_api.is_empty() {
			for id in self.enable_proposed_api.iter() {
				target.push(format!("--enable-proposed-api={id}"));
			}
		}
		self.code_options.add_code_args(target);
	}
}

/// Arguments applicable whenever the desktop editor is launched
#[derive(Args, Debug, Default, Clone)]
pub struct DesktopCodeOptions {
	/// Set the root path for extensions.
	#[clap(long, value_name = "dir")]
	pub extensions_dir: Option<String>,

	/// Specifies the directory that user data is kept in. Can be used to
	/// open multiple distinct instances of the editor.
	#[clap(long, value_name = "dir")]
	pub user_data_dir: Option<String>,

	/// Sets the editor version to use for this command. The preferred version
	/// can be persisted with `code version use <version>`. Can be "stable",
	/// "insiders", a version number, or an absolute path to an existing install.
	#[clap(long, value_name = "stable | insiders | x.y.z | path")]
	pub use_version: Option<String>,
}

/// Argument specifying the output format.
#[derive(Args, Debug, Clone)]
pub struct OutputFormatOptions {
	/// Set the data output formats.
	#[clap(value_enum, long, value_name = "format", default_value_t = OutputFormat::Text)]
	pub format: OutputFormat,
}

impl DesktopCodeOptions {
	pub fn add_code_args(&self, target: &mut Vec<String>) {
		if let Some(extensions_dir) = &self.extensions_dir {
			target.push(format!("--extensions-dir={extensions_dir}"));
		}
		if let Some(user_data_dir) = &self.user_data_dir {
			target.push(format!("--user-data-dir={user_data_dir}"));
		}
	}
}

#[derive(Args, Debug, Default, Clone)]
pub struct GlobalOptions {
	/// Directory where CLI metadata should be stored.
	#[clap(long, env = "VSCODE_CLI_DATA_DIR", global = true)]
	pub cli_data_dir: Option<String>,

	/// Print verbose output (implies --wait).
	#[clap(long, global = true)]
	pub verbose: bool,

	/// Log to a file in addition to stdout. Used when running as a service.
	#[clap(long, global = true, hide = true)]
	pub log_to_file: Option<PathBuf>,

	/// Log level to use.
	#[clap(long, value_enum, value_name = "level", global = true)]
	pub log: Option<log::Level>,

	/// Disable telemetry for the current command, even if it was previously
	/// accepted as part of the license prompt or specified in '--telemetry-level'
	#[clap(long, global = true, hide = true)]
	pub disable_telemetry: bool,

	/// Sets the initial telemetry level
	#[clap(value_enum, long, global = true, hide = true)]
	pub telemetry_level: Option<options::TelemetryLevel>,
}

impl GlobalOptions {
	pub fn add_code_args(&self, target: &mut Vec<String>) {
		if self.verbose {
			target.push("--verbose".to_string());
		}
		if let Some(log) = self.log {
			target.push(format!("--log={log}"));
		}
		if self.disable_telemetry {
			target.push("--disable-telemetry".to_string());
		}
		if let Some(telemetry_level) = &self.telemetry_level {
			target.push(format!("--telemetry-level={telemetry_level}"));
		}
	}
}

#[derive(Args, Debug, Default, Clone)]
pub struct EditorTroubleshooting {
	/// Run CPU profiler during startup.
	#[clap(long)]
	pub prof_startup: bool,

	/// Disable all installed extensions.
	#[clap(long)]
	pub disable_extensions: bool,

	/// Disable an extension.
	#[clap(long, value_name = "ext-id")]
	pub disable_extension: Vec<String>,

	/// Turn sync on or off.
	#[clap(value_enum, long, value_name = "on | off")]
	pub sync: Option<SyncState>,

	/// Allow debugging and profiling of extensions. Check the developer tools for the connection URI.
	#[clap(long, value_name = "port")]
	pub inspect_extensions: Option<u16>,

	/// Allow debugging and profiling of extensions with the extension host
	/// being paused after start. Check the developer tools for the connection URI.
	#[clap(long, value_name = "port")]
	pub inspect_brk_extensions: Option<u16>,

	/// Disable GPU hardware acceleration.
	#[clap(long)]
	pub disable_gpu: bool,

	/// Shows all telemetry events which the editor collects.
	#[clap(long)]
	pub telemetry: bool,
}

impl EditorTroubleshooting {
	pub fn add_code_args(&self, target: &mut Vec<String>) {
		if self.prof_startup {
			target.push("--prof-startup".to_string());
		}
		if self.disable_extensions {
			target.push("--disable-extensions".to_string());
		}
		for id in self.disable_extension.iter() {
			target.push(format!("--disable-extension={id}"));
		}
		if let Some(sync) = &self.sync {
			target.push(format!("--sync={sync}"));
		}
		if let Some(port) = &self.inspect_extensions {
			target.push(format!("--inspect-extensions={port}"));
		}
		if let Some(port) = &self.inspect_brk_extensions {
			target.push(format!("--inspect-brk-extensions={port}"));
		}
		if self.disable_gpu {
			target.push("--disable-gpu".to_string());
		}
		if self.telemetry {
			target.push("--telemetry".to_string());
		}
	}
}

#[derive(ValueEnum, Clone, Copy, Debug)]
pub enum SyncState {
	On,
	Off,
}

impl fmt::Display for SyncState {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		match self {
			SyncState::Off => write!(f, "off"),
			SyncState::On => write!(f, "on"),
		}
	}
}

#[derive(ValueEnum, Clone, Copy, Debug)]
pub enum OutputFormat {
	Json,
	Text,
}

#[derive(Args, Clone, Debug, Default)]
pub struct ExistingTunnelArgs {
	/// Name you'd like to assign preexisting tunnel to use to connect the tunnel
	/// Old option, new code should just use `--name`.
	#[clap(long, hide = true)]
	pub tunnel_name: Option<String>,

	/// Token to authenticate and use preexisting tunnel
	#[clap(long, hide = true)]
	pub host_token: Option<String>,

	/// ID of preexisting tunnel to use to connect the tunnel
	#[clap(long, hide = true)]
	pub tunnel_id: Option<String>,

	/// Cluster of preexisting tunnel to use to connect the tunnel
	#[clap(long, hide = true)]
	pub cluster: Option<String>,
}

#[derive(Args, Debug, Clone, Default)]
pub struct TunnelServeArgs {
	#[clap(flatten)]
	pub server_args: BaseServerArgs,

	/// Optional details to connect to an existing tunnel
	#[clap(flatten, next_help_heading = Some("ADVANCED OPTIONS"))]
	pub tunnel: ExistingTunnelArgs,

	/// Randomly name machine for port forwarding service
	#[clap(long)]
	pub random_name: bool,

	/// Prevents the machine going to sleep while this command runs.
	#[clap(long)]
	pub no_sleep: bool,

	/// Sets the machine name for port forwarding service
	#[clap(long)]
	pub name: Option<String>,

	/// Optional parent process id. If provided, the server will be stopped when the process of the given pid no longer exists
	#[clap(long, hide = true)]
	pub parent_process_id: Option<String>,

	/// If set, the user accepts the server license terms and the server will be started without a user prompt.
	#[clap(long)]
	pub accept_server_license_terms: bool,
}

#[derive(Args, Debug, Clone, Default)]
pub struct BaseServerArgs {
	/// Requests that extensions be preloaded and installed on connecting servers.
	#[clap(long)]
	pub install_extension: Vec<String>,

	/// Specifies the directory that server data is kept in.
	#[clap(long)]
	pub server_data_dir: Option<String>,

	/// Set the root path for extensions.
	#[clap(long)]
	pub extensions_dir: Option<String>,

	/// Reconnection grace time in seconds. Defaults to 10800 (3 hours).
	#[clap(long)]
	pub reconnection_grace_time: Option<u32>,
}

impl BaseServerArgs {
	pub fn apply_to(&self, csa: &mut CodeServerArgs) {
		csa.install_extensions
			.extend_from_slice(&self.install_extension);

		if let Some(d) = &self.server_data_dir {
			csa.server_data_dir = Some(d.clone());
		}

		if let Some(d) = &self.extensions_dir {
			csa.extensions_dir = Some(d.clone());
		}

		if let Some(t) = self.reconnection_grace_time {
			csa.reconnection_grace_time = Some(t);
		}
	}
}

#[derive(Args, Debug, Clone)]
pub struct TunnelArgs {
	#[clap(subcommand)]
	pub subcommand: Option<TunnelSubcommand>,

	#[clap(flatten)]
	pub serve_args: TunnelServeArgs,
}

#[derive(Subcommand, Debug, Clone)]
pub enum TunnelSubcommand {
	/// Delete all servers which are currently not running.
	Prune,

	/// Stops any running tunnel on the system.
	Kill,

	/// Restarts any running tunnel on the system.
	Restart,

	/// Gets whether there is a tunnel running on the current machine.
	Status,

	/// Rename the name of this machine associated with port forwarding service.
	Rename(TunnelRenameArgs),

	/// Remove this machine's association with the port forwarding service.
	Unregister,

	#[clap(subcommand)]
	User(TunnelUserSubCommands),

	/// (Preview) Manages the tunnel when installed as a system service,
	#[clap(subcommand)]
	Service(TunnelServiceSubCommands),

	/// (Preview) Forwards local port using the dev tunnel
	#[clap(hide = true)]
	ForwardInternal(TunnelForwardArgs),
}

#[derive(Subcommand, Debug, Clone)]
pub enum TunnelServiceSubCommands {
	/// Installs or re-installs the tunnel service on the machine.
	Install(TunnelServiceInstallArgs),

	/// Uninstalls and stops the tunnel service.
	Uninstall,

	/// Shows logs for the running service.
	Log,

	/// Internal command for running the service
	#[clap(hide = true)]
	InternalRun,
}

#[derive(Args, Debug, Clone)]
pub struct TunnelServiceInstallArgs {
	/// If set, the user accepts the server license terms and the server will be started without a user prompt.
	#[clap(long)]
	pub accept_server_license_terms: bool,

	/// Sets the machine name for port forwarding service
	#[clap(long)]
	pub name: Option<String>,
}

#[derive(Args, Debug, Clone)]
pub struct TunnelRenameArgs {
	/// The name you'd like to rename your machine to.
	pub name: String,
}

#[derive(Args, Debug, Clone)]
pub struct TunnelForwardArgs {
	/// One or more ports to forward.
	pub ports: Vec<u16>,

	/// Login args -- used for convenience so the forwarding call is a single action.
	#[clap(flatten)]
	pub login: LoginArgs,
}

#[derive(Subcommand, Debug, Clone)]
pub enum TunnelUserSubCommands {
	/// Log in to port forwarding service
	Login(LoginArgs),

	/// Log out of port forwarding service
	Logout,

	/// Show the account that's logged into port forwarding service
	Show,
}

#[derive(Args, Debug, Clone)]
pub struct LoginArgs {
	/// An access token to store for authentication.
	#[clap(long, requires = "provider", env = "VSCODE_CLI_ACCESS_TOKEN")]
	pub access_token: Option<String>,

	/// An access token to store for authentication.
	#[clap(long, requires = "access_token", env = "VSCODE_CLI_REFRESH_TOKEN")]
	pub refresh_token: Option<String>,

	/// The auth provider to use. If not provided, a prompt will be shown.
	#[clap(value_enum, long)]
	pub provider: Option<AuthProvider>,
}

#[derive(clap::ValueEnum, Debug, Clone, Copy)]
pub enum AuthProvider {
	Microsoft,
	Github,
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/commands/context.rs]---
Location: vscode-main/cli/src/commands/context.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use crate::{log, state::LauncherPaths};

use super::args::CliCore;

pub struct CommandContext {
	pub log: log::Logger,
	pub paths: LauncherPaths,
	pub args: CliCore,
	pub http: reqwest::Client,
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/commands/output.rs]---
Location: vscode-main/cli/src/commands/output.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use std::fmt::Display;

use std::io::{BufWriter, Write};

use super::args::OutputFormat;

pub struct Column {
	max_width: usize,
	heading: &'static str,
	data: Vec<String>,
}

impl Column {
	pub fn new(heading: &'static str) -> Self {
		Column {
			max_width: heading.len(),
			heading,
			data: vec![],
		}
	}

	pub fn add_row(&mut self, row: String) {
		self.max_width = std::cmp::max(self.max_width, row.len());
		self.data.push(row);
	}
}

impl OutputFormat {
	pub fn print_table(&self, table: OutputTable) -> Result<(), std::io::Error> {
		match *self {
			OutputFormat::Json => JsonTablePrinter().print(table, &mut std::io::stdout()),
			OutputFormat::Text => TextTablePrinter().print(table, &mut std::io::stdout()),
		}
	}
}

pub struct OutputTable {
	cols: Vec<Column>,
}

impl OutputTable {
	pub fn new(cols: Vec<Column>) -> Self {
		OutputTable { cols }
	}
}

trait TablePrinter {
	fn print(&self, table: OutputTable, out: &mut dyn std::io::Write)
		-> Result<(), std::io::Error>;
}

pub struct JsonTablePrinter();

impl TablePrinter for JsonTablePrinter {
	fn print(
		&self,
		table: OutputTable,
		out: &mut dyn std::io::Write,
	) -> Result<(), std::io::Error> {
		let mut bw = BufWriter::new(out);
		bw.write_all(b"[")?;

		if !table.cols.is_empty() {
			let data_len = table.cols[0].data.len();
			for i in 0..data_len {
				if i > 0 {
					bw.write_all(b",{")?;
				} else {
					bw.write_all(b"{")?;
				}
				for col in &table.cols {
					serde_json::to_writer(&mut bw, col.heading)?;
					bw.write_all(b":")?;
					serde_json::to_writer(&mut bw, &col.data[i])?;
				}
			}
		}

		bw.write_all(b"]")?;
		bw.flush()
	}
}

/// Type that prints the output as an ASCII, markdown-style table.
pub struct TextTablePrinter();

impl TablePrinter for TextTablePrinter {
	fn print(
		&self,
		table: OutputTable,
		out: &mut dyn std::io::Write,
	) -> Result<(), std::io::Error> {
		let mut bw = BufWriter::new(out);

		let sizes = table.cols.iter().map(|c| c.max_width).collect::<Vec<_>>();

		// print headers
		write_columns(&mut bw, table.cols.iter().map(|c| c.heading), &sizes)?;
		// print --- separators
		write_columns(
			&mut bw,
			table.cols.iter().map(|c| "-".repeat(c.max_width)),
			&sizes,
		)?;
		// print each column
		if !table.cols.is_empty() {
			let data_len = table.cols[0].data.len();
			for i in 0..data_len {
				write_columns(&mut bw, table.cols.iter().map(|c| &c.data[i]), &sizes)?;
			}
		}

		bw.flush()
	}
}

fn write_columns<T>(
	mut w: impl Write,
	cols: impl Iterator<Item = T>,
	sizes: &[usize],
) -> Result<(), std::io::Error>
where
	T: Display,
{
	w.write_all(b"|")?;
	for (i, col) in cols.enumerate() {
		write!(w, " {:width$} |", col, width = sizes[i])?;
	}
	w.write_all(b"\r\n")
}
```

--------------------------------------------------------------------------------

---[FILE: cli/src/commands/serve_web.rs]---
Location: vscode-main/cli/src/commands/serve_web.rs

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use std::collections::HashMap;
use std::convert::Infallible;
use std::fs;
use std::io::{Read, Write};
use std::net::{IpAddr, Ipv4Addr, SocketAddr};
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use hyper::service::{make_service_fn, service_fn};
use hyper::{Body, Request, Response, Server};
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::{pin, time};

use crate::async_pipe::{
	get_socket_name, get_socket_rw_stream, listen_socket_rw_stream, AsyncPipe,
};
use crate::constants::VSCODE_CLI_QUALITY;
use crate::download_cache::DownloadCache;
use crate::log;
use crate::options::Quality;
use crate::state::{LauncherPaths, PersistedState};
use crate::tunnels::shutdown_signal::ShutdownRequest;
use crate::update_service::{
	unzip_downloaded_release, Platform, Release, TargetKind, UpdateService,
};
use crate::util::command::new_script_command;
use crate::util::errors::AnyError;
use crate::util::http::{self, ReqwestSimpleHttp};
use crate::util::io::SilentCopyProgress;
use crate::util::sync::{new_barrier, Barrier, BarrierOpener};
use crate::{
	tunnels::legal,
	util::{errors::CodeError, prereqs::PreReqChecker},
};

use super::{args::ServeWebArgs, CommandContext};

/// Length of a commit hash, for validation
const COMMIT_HASH_LEN: usize = 40;
/// Number of seconds where, if there's no connections to a VS Code server,
/// the server is shut down.
const SERVER_IDLE_TIMEOUT_SECS: u64 = 60 * 60;
/// Number of seconds in which the server times out when there is a connection
/// (should be large enough to basically never happen)
const SERVER_ACTIVE_TIMEOUT_SECS: u64 = SERVER_IDLE_TIMEOUT_SECS * 24 * 30 * 12;
/// How long to cache the "latest" version we get from the update service.
const RELEASE_CHECK_INTERVAL: u64 = 60 * 60;

/// Number of bytes for the secret keys. See workbench.ts for their usage.
const SECRET_KEY_BYTES: usize = 32;
/// Path to mint the key combining server and client parts.
const SECRET_KEY_MINT_PATH: &str = "_vscode-cli/mint-key";
/// Cookie set to the `SECRET_KEY_MINT_PATH`
const PATH_COOKIE_NAME: &str = "vscode-secret-key-path";
/// HTTP-only cookie where the client's secret half is stored.
const SECRET_KEY_COOKIE_NAME: &str = "vscode-cli-secret-half";

/// Implements the vscode "server of servers". Clients who go to the URI get
/// served the latest version of the VS Code server whenever they load the
/// page. The VS Code server prefixes all assets and connections it loads with
/// its version string, so existing clients can continue to get served even
/// while new clients get new VS Code Server versions.
pub async fn serve_web(ctx: CommandContext, mut args: ServeWebArgs) -> Result<i32, AnyError> {
	legal::require_consent(&ctx.paths, args.accept_server_license_terms)?;

	let platform: crate::update_service::Platform = PreReqChecker::new().verify().await?;
	if !args.without_connection_token {
		if let Some(p) = args.connection_token_file.as_deref() {
			let token = fs::read_to_string(PathBuf::from(p))
				.map_err(CodeError::CouldNotReadConnectionTokenFile)?;
			args.connection_token = Some(token.trim().to_string());
		} else {
			// Ensure there's a defined connection token, since if multiple server versions
			// are executed, they will need to have a single shared token.
			let token_path = ctx.paths.root().join("serve-web-token");
			let token = mint_connection_token(&token_path, args.connection_token.clone())
				.map_err(CodeError::CouldNotCreateConnectionTokenFile)?;
			args.connection_token = Some(token);
			args.connection_token_file = Some(token_path.to_string_lossy().to_string());
		}
	}

	let cm: Arc<ConnectionManager> = ConnectionManager::new(&ctx, platform, args.clone());
	let update_check_interval = 3600;
	if args.commit_id.is_none() {
		cm.clone()
			.start_update_checker(Duration::from_secs(update_check_interval));
	} else {
		// If a commit was provided, invoke get_latest_release() once to ensure we're using that exact version;
		// get_latest_release() will short-circuit to args.commit_id.
		if let Err(e) = cm.get_latest_release().await {
			warning!(cm.log, "error getting latest version: {}", e);
		}
	}

	let key = get_server_key_half(&ctx.paths);
	let make_svc = move || {
		let ctx = HandleContext {
			cm: cm.clone(),
			log: cm.log.clone(),
			server_secret_key: key.clone(),
		};
		let service = service_fn(move |req| handle(ctx.clone(), req));
		async move { Ok::<_, Infallible>(service) }
	};

	let mut shutdown = ShutdownRequest::create_rx([ShutdownRequest::CtrlC]);
	let r = if let Some(s) = args.socket_path {
		let s = PathBuf::from(&s);
		let socket = listen_socket_rw_stream(&s).await?;
		ctx.log
			.result(format!("Web UI available on {}", s.display()));
		let r = Server::builder(socket.into_pollable())
			.serve(make_service_fn(|_| make_svc()))
			.with_graceful_shutdown(async {
				let _ = shutdown.wait().await;
			})
			.await;
		let _ = std::fs::remove_file(&s); // cleanup
		r
	} else {
		let addr: SocketAddr = match &args.host {
			Some(h) => {
				SocketAddr::new(h.parse().map_err(CodeError::InvalidHostAddress)?, args.port)
			}
			None => SocketAddr::new(IpAddr::V4(Ipv4Addr::LOCALHOST), args.port),
		};
		let builder = Server::try_bind(&addr).map_err(CodeError::CouldNotListenOnInterface)?;

		// Get the actual bound address (important when port 0 is used for random port assignment)
		let bound_addr = builder.local_addr();
		let mut listening = format!("Web UI available at http://{bound_addr}");
		if let Some(base) = args.server_base_path {
			if !base.starts_with('/') {
				listening.push('/');
			}
			listening.push_str(&base);
		}
		if let Some(ct) = args.connection_token {
			listening.push_str(&format!("?tkn={ct}"));
		}
		ctx.log.result(listening);

		builder
			.serve(make_service_fn(|_| make_svc()))
			.with_graceful_shutdown(async {
				let _ = shutdown.wait().await;
			})
			.await
	};

	r.map_err(CodeError::CouldNotListenOnInterface)?;

	Ok(0)
}

#[derive(Clone)]
struct HandleContext {
	cm: Arc<ConnectionManager>,
	log: log::Logger,
	server_secret_key: SecretKeyPart,
}

/// Handler function for an inbound request
async fn handle(ctx: HandleContext, req: Request<Body>) -> Result<Response<Body>, Infallible> {
	let client_key_half = get_client_key_half(&req);
	let path = req.uri().path();

	let mut res = if path.starts_with(&ctx.cm.base_path)
		&& path.get(ctx.cm.base_path.len()..).unwrap_or_default() == SECRET_KEY_MINT_PATH
	{
		handle_secret_mint(&ctx, req)
	} else {
		handle_proxied(&ctx, req).await
	};

	append_secret_headers(&ctx.cm.base_path, &mut res, &client_key_half);

	Ok(res)
}

async fn handle_proxied(ctx: &HandleContext, req: Request<Body>) -> Response<Body> {
	let release = if let Some((r, _)) = get_release_from_path(req.uri().path(), ctx.cm.platform) {
		r
	} else {
		match ctx.cm.get_release_from_cache().await {
			Ok(r) => r,
			Err(e) => {
				error!(ctx.log, "error getting latest version: {}", e);
				return response::code_err(e);
			}
		}
	};

	match ctx.cm.get_connection(release).await {
		Ok(rw) => {
			if req.headers().contains_key(hyper::header::UPGRADE) {
				forward_ws_req_to_server(ctx.log.clone(), rw, req).await
			} else {
				forward_http_req_to_server(rw, req).await
			}
		}
		Err(CodeError::ServerNotYetDownloaded) => response::wait_for_download(),
		Err(e) => response::code_err(e),
	}
}

fn handle_secret_mint(ctx: &HandleContext, req: Request<Body>) -> Response<Body> {
	use sha2::{Digest, Sha256};

	let mut hasher = Sha256::new();
	hasher.update(ctx.server_secret_key.0.as_ref());
	hasher.update(get_client_key_half(&req).0.as_ref());
	let hash = hasher.finalize();
	let hash = hash[..SECRET_KEY_BYTES].to_vec();
	response::secret_key(hash)
}

/// Appends headers to response to maintain the secret storage of the workbench:
/// sets the `PATH_COOKIE_VALUE` so workbench.ts knows about the 'mint' endpoint,
/// and maintains the http-only cookie the client will use for cookies.
fn append_secret_headers(
	base_path: &str,
	res: &mut Response<Body>,
	client_key_half: &SecretKeyPart,
) {
	let headers = res.headers_mut();
	headers.append(
		hyper::header::SET_COOKIE,
		format!("{PATH_COOKIE_NAME}={base_path}{SECRET_KEY_MINT_PATH}; SameSite=Strict; Path=/",)
			.parse()
			.unwrap(),
	);
	headers.append(
		hyper::header::SET_COOKIE,
		format!(
			"{}={}; SameSite=Strict; HttpOnly; Max-Age=2592000; Path=/",
			SECRET_KEY_COOKIE_NAME,
			client_key_half.encode()
		)
		.parse()
		.unwrap(),
	);
}

/// Gets the release info from the VS Code path prefix, which is in the
/// format `/<quality>-<commit>/...`
fn get_release_from_path(path: &str, platform: Platform) -> Option<(Release, String)> {
	if !path.starts_with('/') {
		return None; // paths must start with '/'
	}

	let path = &path[1..];
	let i = path.find('/').unwrap_or(path.len());
	let quality_commit_sep = path.get(..i).and_then(|p| p.find('-'))?;

	let (quality_commit, remaining) = path.split_at(i);
	let (quality, commit) = quality_commit.split_at(quality_commit_sep);
	let commit = &commit[1..];

	if !is_commit_hash(commit) {
		return None;
	}

	Some((
		Release {
			// remember to trim off the leading '/' which is now part of th quality
			quality: Quality::try_from(quality).ok()?,
			commit: commit.to_string(),
			platform,
			target: TargetKind::Web,
			name: "".to_string(),
		},
		remaining.to_string(),
	))
}

/// Proxies the standard HTTP request to the async pipe, returning the piped response
async fn forward_http_req_to_server(
	(rw, handle): (AsyncPipe, ConnectionHandle),
	req: Request<Body>,
) -> Response<Body> {
	let (mut request_sender, connection) =
		match hyper::client::conn::Builder::new().handshake(rw).await {
			Ok(r) => r,
			Err(e) => return response::connection_err(e),
		};

	tokio::spawn(connection);

	let res = request_sender
		.send_request(req)
		.await
		.unwrap_or_else(response::connection_err);

	// technically, we should buffer the body into memory since it may not be
	// read at this point, but because the keepalive time is very large
	// there's not going to be responses that take hours to send and x
	// cause us to kill the server before the response is sent
	drop(handle);

	res
}

/// Proxies the websocket request to the async pipe
async fn forward_ws_req_to_server(
	log: log::Logger,
	(rw, handle): (AsyncPipe, ConnectionHandle),
	mut req: Request<Body>,
) -> Response<Body> {
	// splicing of client and servers inspired by https://github.com/hyperium/hyper/blob/fece9f7f50431cf9533cfe7106b53a77b48db699/examples/upgrades.rs
	let (mut request_sender, connection) =
		match hyper::client::conn::Builder::new().handshake(rw).await {
			Ok(r) => r,
			Err(e) => return response::connection_err(e),
		};

	tokio::spawn(connection);

	let mut proxied_req = Request::builder().uri(req.uri());
	for (k, v) in req.headers() {
		proxied_req = proxied_req.header(k, v);
	}

	let mut res = request_sender
		.send_request(proxied_req.body(Body::empty()).unwrap())
		.await
		.unwrap_or_else(response::connection_err);

	let mut proxied_res = Response::new(Body::empty());
	*proxied_res.status_mut() = res.status();
	for (k, v) in res.headers() {
		proxied_res.headers_mut().insert(k, v.clone());
	}

	// only start upgrade at this point in case the server decides to deny socket
	if res.status() == hyper::StatusCode::SWITCHING_PROTOCOLS {
		tokio::spawn(async move {
			let (s_req, s_res) =
				tokio::join!(hyper::upgrade::on(&mut req), hyper::upgrade::on(&mut res));

			match (s_req, s_res) {
				(Err(e1), Err(e2)) => debug!(
					log,
					"client ({}) and server ({}) websocket upgrade failed", e1, e2
				),
				(Err(e1), _) => debug!(log, "client ({}) websocket upgrade failed", e1),
				(_, Err(e2)) => debug!(log, "server ({}) websocket upgrade failed", e2),
				(Ok(mut s_req), Ok(mut s_res)) => {
					trace!(log, "websocket upgrade succeeded");
					let r = tokio::io::copy_bidirectional(&mut s_req, &mut s_res).await;
					trace!(log, "websocket closed (error: {:?})", r.err());
				}
			}

			drop(handle);
		});
	}

	proxied_res
}

/// Returns whether the string looks like a commit hash.
fn is_commit_hash(s: &str) -> bool {
	s.len() == COMMIT_HASH_LEN && s.chars().all(|c| c.is_ascii_hexdigit())
}

/// Gets a cookie from the request by name.
fn extract_cookie(req: &Request<Body>, name: &str) -> Option<String> {
	for h in req.headers().get_all(hyper::header::COOKIE) {
		if let Ok(str) = h.to_str() {
			for pair in str.split("; ") {
				let i = match pair.find('=') {
					Some(i) => i,
					None => continue,
				};

				if &pair[..i] == name {
					return Some(pair[i + 1..].to_string());
				}
			}
		}
	}

	None
}

#[derive(Clone)]
struct SecretKeyPart(Box<[u8; SECRET_KEY_BYTES]>);

impl SecretKeyPart {
	pub fn new() -> Self {
		let key: [u8; SECRET_KEY_BYTES] = rand::random();
		Self(Box::new(key))
	}

	pub fn decode(s: &str) -> Result<Self, base64::DecodeSliceError> {
		use base64::{engine::general_purpose, Engine as _};
		let mut key: [u8; SECRET_KEY_BYTES] = [0; SECRET_KEY_BYTES];
		let v = general_purpose::URL_SAFE.decode(s)?;
		if v.len() != SECRET_KEY_BYTES {
			return Err(base64::DecodeSliceError::OutputSliceTooSmall);
		}

		key.copy_from_slice(&v);
		Ok(Self(Box::new(key)))
	}

	pub fn encode(&self) -> String {
		use base64::{engine::general_purpose, Engine as _};
		general_purpose::URL_SAFE.encode(self.0.as_ref())
	}
}

/// Gets the server's half of the secret key.
fn get_server_key_half(paths: &LauncherPaths) -> SecretKeyPart {
	let ps = PersistedState::new(paths.root().join("serve-web-key-half"));
	let value: String = ps.load();
	if let Ok(sk) = SecretKeyPart::decode(&value) {
		return sk;
	}

	let key = SecretKeyPart::new();
	let _ = ps.save(key.encode());
	key
}

/// Gets the client's half of the secret key.
fn get_client_key_half(req: &Request<Body>) -> SecretKeyPart {
	if let Some(c) = extract_cookie(req, SECRET_KEY_COOKIE_NAME) {
		if let Ok(sk) = SecretKeyPart::decode(&c) {
			return sk;
		}
	}

	SecretKeyPart::new()
}

/// Module holding original responses the CLI's server makes.
mod response {
	use const_format::concatcp;

	use crate::constants::QUALITYLESS_SERVER_NAME;

	use super::*;

	pub fn connection_err(err: hyper::Error) -> Response<Body> {
		Response::builder()
			.status(503)
			.body(Body::from(format!("Error connecting to server: {err:?}")))
			.unwrap()
	}

	pub fn code_err(err: CodeError) -> Response<Body> {
		Response::builder()
			.status(500)
			.body(Body::from(format!("Error serving request: {err}")))
			.unwrap()
	}

	pub fn wait_for_download() -> Response<Body> {
		Response::builder()
			.status(202)
			.header("Content-Type", "text/html") // todo: get latest
			.body(Body::from(concatcp!("The latest version of the ", QUALITYLESS_SERVER_NAME, " is downloading, please wait a moment...<script>setTimeout(()=>location.reload(),1500)</script>", )))
			.unwrap()
	}

	pub fn secret_key(hash: Vec<u8>) -> Response<Body> {
		Response::builder()
			.status(200)
			.header("Content-Type", "application/octet-stream") // todo: get latest
			.body(Body::from(hash))
			.unwrap()
	}
}

/// Handle returned when getting a stream to the server, used to refcount
/// connections to a server so it can be disposed when there are no more clients.
struct ConnectionHandle {
	client_counter: Arc<tokio::sync::watch::Sender<usize>>,
}

impl ConnectionHandle {
	pub fn new(client_counter: Arc<tokio::sync::watch::Sender<usize>>) -> Self {
		client_counter.send_modify(|v| {
			*v += 1;
		});
		Self { client_counter }
	}
}

impl Drop for ConnectionHandle {
	fn drop(&mut self) {
		self.client_counter.send_modify(|v| {
			*v -= 1;
		});
	}
}

type StartData = (PathBuf, Arc<tokio::sync::watch::Sender<usize>>);

/// State stored in the ConnectionManager for each server version.
struct VersionState {
	downloaded: bool,
	socket_path: Barrier<Result<StartData, String>>,
}

type ConnectionStateMap = Arc<Mutex<HashMap<(Quality, String), VersionState>>>;

/// Manages the connections to running web UI instances. Multiple web servers
/// can run concurrently, with routing based on the URL path.
struct ConnectionManager {
	pub platform: Platform,
	pub log: log::Logger,
	args: ServeWebArgs,
	/// Server base path, ending in `/`
	base_path: String,
	/// Cache where servers are stored
	cache: DownloadCache,
	/// Mapping of (Quality, Commit) to the state each server is in
	state: ConnectionStateMap,
	/// Update service instance
	update_service: UpdateService,
	/// Cache of the latest released version, storing the time we checked as well
	latest_version: tokio::sync::Mutex<Option<(Instant, Release)>>,
}

fn key_for_release(release: &Release) -> (Quality, String) {
	(release.quality, release.commit.clone())
}

fn normalize_base_path(p: &str) -> String {
	let p = p.trim_matches('/');

	if p.is_empty() {
		return "/".to_string();
	}

	format!("/{}/", p.trim_matches('/'))
}

impl ConnectionManager {
	pub fn new(ctx: &CommandContext, platform: Platform, args: ServeWebArgs) -> Arc<Self> {
		let base_path = normalize_base_path(args.server_base_path.as_deref().unwrap_or_default());

		let cache = DownloadCache::new(ctx.paths.web_server_storage());
		let target_kind = TargetKind::Web;

		let quality = VSCODE_CLI_QUALITY.map_or(Quality::Stable, |q| match Quality::try_from(q) {
			Ok(q) => q,
			Err(_) => Quality::Stable,
		});

		let now = Instant::now();
		let latest_version = tokio::sync::Mutex::new(cache.get().first().map(|latest_commit| {
			(
				now.checked_sub(Duration::from_secs(RELEASE_CHECK_INTERVAL))
					.unwrap_or(now), // handle 0-ish instants, #233155
				Release {
					name: String::from("0.0.0"), // Version information not stored on cache
					commit: latest_commit.clone(),
					platform,
					target: target_kind,
					quality,
				},
			)
		}));

		Arc::new(Self {
			platform,
			args,
			base_path,
			log: ctx.log.clone(),
			cache,
			update_service: UpdateService::new(
				ctx.log.clone(),
				Arc::new(ReqwestSimpleHttp::with_client(ctx.http.clone())),
			),
			state: ConnectionStateMap::default(),
			latest_version,
		})
	}

	// spawns a task that checks for updates every n seconds duration
	pub fn start_update_checker(self: Arc<Self>, duration: Duration) {
		tokio::spawn(async move {
			let mut interval = time::interval(duration);
			loop {
				interval.tick().await;

				if let Err(e) = self.get_latest_release().await {
					warning!(self.log, "error getting latest version: {}", e);
				}
			}
		});
	}

	// Returns the latest release from the cache, if one exists.
	pub async fn get_release_from_cache(&self) -> Result<Release, CodeError> {
		let latest = self.latest_version.lock().await;
		if let Some((_, release)) = &*latest {
			return Ok(release.clone());
		}

		drop(latest);
		self.get_latest_release().await
	}

	/// Gets a connection to a server version
	pub async fn get_connection(
		&self,
		release: Release,
	) -> Result<(AsyncPipe, ConnectionHandle), CodeError> {
		// todo@connor4312: there is likely some performance benefit to
		// implementing a 'keepalive' for these connections.
		let (path, counter) = self.get_version_data(release).await?;
		let handle = ConnectionHandle::new(counter);
		let rw = get_socket_rw_stream(&path).await?;
		Ok((rw, handle))
	}

	/// Gets the latest release for the CLI quality, caching its result for some
	/// time to allow for fast loads.
	pub async fn get_latest_release(&self) -> Result<Release, CodeError> {
		let mut latest = self.latest_version.lock().await;
		let now = Instant::now();
		let target_kind = TargetKind::Web;

		let quality = VSCODE_CLI_QUALITY
			.ok_or_else(|| CodeError::UpdatesNotConfigured("no configured quality"))
			.and_then(|q| {
				Quality::try_from(q).map_err(|_| CodeError::UpdatesNotConfigured("unknown quality"))
			})?;

		if let Some(commit) = &self.args.commit_id {
			let release = Release {
				name: commit.to_string(),
				commit: commit.to_string(),
				platform: self.platform,
				target: target_kind,
				quality,
			};
			debug!(
				self.log,
				"using provided commit instead of latest release: {}", release
			);
			*latest = Some((now, release.clone()));
			return Ok(release);
		}

		let release = self
			.update_service
			.get_latest_commit(self.platform, target_kind, quality)
			.await
			.map_err(|e| CodeError::UpdateCheckFailed(e.to_string()));

		// If the update service is unavailable and we have stale data, use that
		if let (Err(e), Some((_, previous))) = (&release, latest.clone()) {
			warning!(self.log, "error getting latest release, using stale: {}", e);
			*latest = Some((now, previous.clone()));
			return Ok(previous.clone());
		}

		let release = release?;
		debug!(self.log, "refreshed latest release: {}", release);
		*latest = Some((now, release.clone()));

		Ok(release)
	}

	/// Gets the StartData for the a version of the VS Code server, triggering
	/// download/start if necessary. It returns `CodeError::ServerNotYetDownloaded`
	/// while the server is downloading, which is used to have a refresh loop on the page.
	async fn get_version_data(&self, release: Release) -> Result<StartData, CodeError> {
		self.get_version_data_inner(release)?
			.wait()
			.await
			.unwrap()
			.map_err(CodeError::ServerDownloadError)
	}

	fn get_version_data_inner(
		&self,
		release: Release,
	) -> Result<Barrier<Result<StartData, String>>, CodeError> {
		let mut state = self.state.lock().unwrap();
		let key = key_for_release(&release);
		if let Some(s) = state.get_mut(&key) {
			if !s.downloaded {
				if s.socket_path.is_open() {
					s.downloaded = true;
				} else {
					return Err(CodeError::ServerNotYetDownloaded);
				}
			}

			return Ok(s.socket_path.clone());
		}

		let (socket_path, opener) = new_barrier();
		let state_map_dup = self.state.clone();
		let args = StartArgs {
			args: self.args.clone(),
			log: self.log.clone(),
			opener,
			release,
		};

		if let Some(p) = self.cache.exists(&args.release.commit) {
			state.insert(
				key.clone(),
				VersionState {
					socket_path: socket_path.clone(),
					downloaded: true,
				},
			);

			tokio::spawn(async move {
				Self::start_version(args, p).await;
				state_map_dup.lock().unwrap().remove(&key);
			});
			Ok(socket_path)
		} else {
			state.insert(
				key.clone(),
				VersionState {
					socket_path,
					downloaded: false,
				},
			);
			let update_service = self.update_service.clone();
			let cache = self.cache.clone();
			tokio::spawn(async move {
				Self::download_version(args, update_service.clone(), cache.clone()).await;
				state_map_dup.lock().unwrap().remove(&key);
			});
			Err(CodeError::ServerNotYetDownloaded)
		}
	}

	/// Downloads a server version into the cache and starts it.
	async fn download_version(
		args: StartArgs,
		update_service: UpdateService,
		cache: DownloadCache,
	) {
		let release_for_fut = args.release.clone();
		let log_for_fut = args.log.clone();
		let dir_fut = cache.create(&args.release.commit, |target_dir| async move {
			info!(log_for_fut, "Downloading server {}", release_for_fut.commit);
			let tmpdir = tempfile::tempdir().unwrap();
			let response = update_service.get_download_stream(&release_for_fut).await?;

			let name = response.url_path_basename().unwrap();
			let archive_path = tmpdir.path().join(name);
			http::download_into_file(
				&archive_path,
				log_for_fut.get_download_logger("Downloading server:"),
				response,
			)
			.await?;
			unzip_downloaded_release(&archive_path, &target_dir, SilentCopyProgress())?;
			Ok(())
		});

		match dir_fut.await {
			Err(e) => args.opener.open(Err(e.to_string())),
			Ok(dir) => Self::start_version(args, dir).await,
		}
	}

	/// Starts a downloaded server that can be found in the given `path`.
	async fn start_version(args: StartArgs, path: PathBuf) {
		info!(args.log, "Starting server {}", args.release.commit);

		let executable = path
			.join("bin")
			.join(args.release.quality.server_entrypoint());

		let socket_path = get_socket_name();

		let mut cmd = new_script_command(&executable);
		cmd.stdin(std::process::Stdio::null());
		cmd.stderr(std::process::Stdio::piped());
		cmd.stdout(std::process::Stdio::piped());
		cmd.arg("--socket-path");
		cmd.arg(&socket_path);

		// License agreement already checked by the `server_web` function.
		cmd.args(["--accept-server-license-terms"]);

		if let Some(a) = &args.args.server_base_path {
			cmd.arg("--server-base-path");
			cmd.arg(a);
		}
		if let Some(a) = &args.args.server_data_dir {
			cmd.arg("--server-data-dir");
			cmd.arg(a);
		}
		if args.args.without_connection_token {
			cmd.arg("--without-connection-token");
		}
		// Note: intentional that we don't pass --connection-token here, we always
		// convert it into the file variant.
		if let Some(ct) = &args.args.connection_token_file {
			cmd.arg("--connection-token-file");
			cmd.arg(ct);
		}

		// removed, otherwise the workbench will not be usable when running the CLI from sources.
		cmd.env_remove("VSCODE_DEV");

		let mut child = match cmd.spawn() {
			Ok(c) => c,
			Err(e) => {
				args.opener.open(Err(e.to_string()));
				return;
			}
		};

		let (mut stdout, mut stderr) = (
			BufReader::new(child.stdout.take().unwrap()).lines(),
			BufReader::new(child.stderr.take().unwrap()).lines(),
		);

		// wrapped option to prove that we only use this once in the loop
		let (counter_tx, mut counter_rx) = tokio::sync::watch::channel(0);
		let mut opener = Some((args.opener, socket_path, Arc::new(counter_tx)));
		let commit_prefix = &args.release.commit[..7];
		let kill_timer = tokio::time::sleep(Duration::from_secs(SERVER_IDLE_TIMEOUT_SECS));
		pin!(kill_timer);

		loop {
			tokio::select! {
				Ok(Some(l)) = stdout.next_line() => {
					info!(args.log, "[{} stdout]: {}", commit_prefix, l);

					if l.contains("Server bound to") {
						if let Some((opener, path, counter_tx)) = opener.take() {
							opener.open(Ok((path, counter_tx)));
						}
					}
				}
				Ok(Some(l)) = stderr.next_line() => {
					info!(args.log, "[{} stderr]: {}", commit_prefix, l);
				},
				n = counter_rx.changed() => {
					kill_timer.as_mut().reset(match n {
						// err means that the record was dropped
						Err(_) => tokio::time::Instant::now(),
						Ok(_) => {
							if *counter_rx.borrow() == 0 {
								tokio::time::Instant::now() + Duration::from_secs(SERVER_IDLE_TIMEOUT_SECS)
							} else {
								tokio::time::Instant::now() + Duration::from_secs(SERVER_ACTIVE_TIMEOUT_SECS)
							}
						}
					});
				}
				_ = &mut kill_timer => {
					info!(args.log, "[{} process]: idle timeout reached, ending", commit_prefix);
					let _ = child.kill().await;
					break;
				}
				e = child.wait() => {
					info!(args.log, "[{} process]: exited: {:?}", commit_prefix, e);
					break;
				}
			}
		}
	}
}

struct StartArgs {
	log: log::Logger,
	args: ServeWebArgs,
	release: Release,
	opener: BarrierOpener<Result<StartData, String>>,
}

fn mint_connection_token(path: &Path, prefer_token: Option<String>) -> std::io::Result<String> {
	#[cfg(not(windows))]
	use std::os::unix::fs::OpenOptionsExt;

	let mut f = fs::OpenOptions::new();
	f.create(true);
	f.write(true);
	f.read(true);
	#[cfg(not(windows))]
	f.mode(0o600);
	let mut f = f.open(path)?;

	if prefer_token.is_none() {
		let mut t = String::new();
		f.read_to_string(&mut t)?;
		let t = t.trim();
		if !t.is_empty() {
			return Ok(t.to_string());
		}
	}

	f.set_len(0)?;
	let prefer_token = prefer_token.unwrap_or_else(|| uuid::Uuid::new_v4().to_string());
	f.write_all(prefer_token.as_bytes())?;
	Ok(prefer_token)
}
```

--------------------------------------------------------------------------------

````
