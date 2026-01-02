---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 279
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 279 of 552)

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

---[FILE: src/vs/platform/mcp/common/mcpGalleryService.ts]---
Location: vscode-main/src/vs/platform/mcp/common/mcpGalleryService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { MarkdownString } from '../../../base/common/htmlContent.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { Schemas } from '../../../base/common/network.js';
import { format2, uppercaseFirstLetter } from '../../../base/common/strings.js';
import { URI } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { IFileService } from '../../files/common/files.js';
import { ILogService } from '../../log/common/log.js';
import { asJson, asText, IRequestService } from '../../request/common/request.js';
import { GalleryMcpServerStatus, IGalleryMcpServer, IMcpGalleryService, IMcpServerArgument, IMcpServerInput, IMcpServerKeyValueInput, IMcpServerPackage, IQueryOptions, RegistryType, SseTransport, StreamableHttpTransport, Transport, TransportType } from './mcpManagement.js';
import { IMcpGalleryManifestService, McpGalleryManifestStatus, getMcpGalleryManifestResourceUri, McpGalleryResourceType, IMcpGalleryManifest } from './mcpGalleryManifest.js';
import { IIterativePager, IIterativePage } from '../../../base/common/paging.js';
import { CancellationError } from '../../../base/common/errors.js';
import { isObject, isString } from '../../../base/common/types.js';

interface IMcpRegistryInfo {
	readonly isLatest?: boolean;
	readonly publishedAt?: string;
	readonly updatedAt?: string;
}

interface IGitHubInfo {
	readonly name: string;
	readonly nameWithOwner: string;
	readonly displayName?: string;
	readonly isInOrganization?: boolean;
	readonly license?: string;
	readonly opengraphImageUrl?: string;
	readonly ownerAvatarUrl?: string;
	readonly preferredImage?: string;
	readonly primaryLanguage?: string;
	readonly primaryLanguageColor?: string;
	readonly pushedAt?: string;
	readonly readme?: string;
	readonly stargazerCount?: number;
	readonly topics?: readonly string[];
	readonly usesCustomOpengraphImage?: boolean;
}

interface IAzureAPICenterInfo {
	readonly 'x-ms-icon'?: string;
}

interface IRawGalleryMcpServersMetadata {
	readonly count: number;
	readonly nextCursor?: string;
}

interface IRawGalleryMcpServersResult {
	readonly metadata: IRawGalleryMcpServersMetadata;
	readonly servers: readonly IRawGalleryMcpServer[];
}

interface IGalleryMcpServersResult {
	readonly metadata: IRawGalleryMcpServersMetadata;
	readonly servers: IGalleryMcpServer[];
}

interface IRawGalleryMcpServer {
	readonly name: string;
	readonly description: string;
	readonly version: string;
	readonly id?: string;
	readonly title?: string;
	readonly repository?: {
		readonly source: string;
		readonly url: string;
		readonly id?: string;
	};
	readonly readme?: string;
	readonly icons?: readonly IRawGalleryMcpServerIcon[];
	readonly status?: GalleryMcpServerStatus;
	readonly websiteUrl?: string;
	readonly createdAt?: string;
	readonly updatedAt?: string;
	readonly packages?: readonly IMcpServerPackage[];
	readonly remotes?: ReadonlyArray<SseTransport | StreamableHttpTransport>;
	readonly registryInfo?: IMcpRegistryInfo;
	readonly githubInfo?: IGitHubInfo;
	readonly apicInfo?: IAzureAPICenterInfo;
}

interface IGalleryMcpServerDataSerializer {
	toRawGalleryMcpServerResult(input: unknown): IRawGalleryMcpServersResult | undefined;
	toRawGalleryMcpServer(input: unknown): IRawGalleryMcpServer | undefined;
}

interface IRawGalleryMcpServerIcon {
	readonly src: string;
	readonly theme?: IconTheme;
	readonly sizes?: string[];
	readonly mimeType?: IconMimeType;
}

const enum IconMimeType {
	PNG = 'image/png',
	JPEG = 'image/jpeg',
	JPG = 'image/jpg',
	SVG = 'image/svg+xml',
	WEBP = 'image/webp',
}

const enum IconTheme {
	LIGHT = 'light',
	DARK = 'dark',
}

namespace McpServerSchemaVersion_v2025_07_09 {

	export const VERSION = 'v0-2025-07-09';
	export const SCHEMA = `https://static.modelcontextprotocol.io/schemas/2025-07-09/server.schema.json`;

	interface RawGalleryMcpServerInput {
		readonly description?: string;
		readonly is_required?: boolean;
		readonly format?: 'string' | 'number' | 'boolean' | 'filepath';
		readonly value?: string;
		readonly is_secret?: boolean;
		readonly default?: string;
		readonly choices?: readonly string[];
	}

	interface RawGalleryMcpServerVariableInput extends RawGalleryMcpServerInput {
		readonly variables?: Record<string, RawGalleryMcpServerInput>;
	}

	interface RawGalleryMcpServerPositionalArgument extends RawGalleryMcpServerVariableInput {
		readonly type: 'positional';
		readonly value_hint?: string;
		readonly is_repeated?: boolean;
	}

	interface RawGalleryMcpServerNamedArgument extends RawGalleryMcpServerVariableInput {
		readonly type: 'named';
		readonly name: string;
		readonly is_repeated?: boolean;
	}

	interface RawGalleryMcpServerKeyValueInput extends RawGalleryMcpServerVariableInput {
		readonly name: string;
		readonly value?: string;
	}

	type RawGalleryMcpServerArgument = RawGalleryMcpServerPositionalArgument | RawGalleryMcpServerNamedArgument;

	interface McpServerDeprecatedRemote {
		readonly transport_type?: 'streamable' | 'sse';
		readonly transport?: 'streamable' | 'sse';
		readonly url: string;
		readonly headers?: ReadonlyArray<RawGalleryMcpServerKeyValueInput>;
	}

	type RawGalleryMcpServerRemotes = ReadonlyArray<SseTransport | StreamableHttpTransport | McpServerDeprecatedRemote>;

	type RawGalleryTransport = StdioTransport | StreamableHttpTransport | SseTransport;

	interface StdioTransport {
		readonly type: 'stdio';
	}

	interface StreamableHttpTransport {
		readonly type: 'streamable-http' | 'sse';
		readonly url: string;
		readonly headers?: ReadonlyArray<RawGalleryMcpServerKeyValueInput>;
	}

	interface SseTransport {
		readonly type: 'sse';
		readonly url: string;
		readonly headers?: ReadonlyArray<RawGalleryMcpServerKeyValueInput>;
	}

	interface RawGalleryMcpServerPackage {
		readonly registry_name: string;
		readonly name: string;
		readonly registry_type: 'npm' | 'pypi' | 'docker-hub' | 'nuget' | 'remote' | 'mcpb';
		readonly registry_base_url?: string;
		readonly identifier: string;
		readonly version: string;
		readonly file_sha256?: string;
		readonly transport?: RawGalleryTransport;
		readonly package_arguments?: readonly RawGalleryMcpServerArgument[];
		readonly runtime_hint?: string;
		readonly runtime_arguments?: readonly RawGalleryMcpServerArgument[];
		readonly environment_variables?: ReadonlyArray<RawGalleryMcpServerKeyValueInput>;
	}

	interface RawGalleryMcpServer {
		readonly $schema: string;
		readonly name: string;
		readonly description: string;
		readonly status?: 'active' | 'deprecated';
		readonly repository?: {
			readonly source: string;
			readonly url: string;
			readonly id?: string;
			readonly readme?: string;
		};
		readonly version: string;
		readonly website_url?: string;
		readonly created_at: string;
		readonly updated_at: string;
		readonly packages?: readonly RawGalleryMcpServerPackage[];
		readonly remotes?: RawGalleryMcpServerRemotes;
		readonly _meta: {
			readonly 'io.modelcontextprotocol.registry/official': {
				readonly id: string;
				readonly is_latest: boolean;
				readonly published_at: string;
				readonly updated_at: string;
				readonly release_date?: string;
			};
			readonly 'io.modelcontextprotocol.registry/publisher-provided'?: Record<string, unknown>;
		};
	}

	interface RawGalleryMcpServersResult {
		readonly metadata: {
			readonly count: number;
			readonly next_cursor?: string;
		};
		readonly servers: readonly RawGalleryMcpServer[];
	}

	interface RawGitHubInfo {
		readonly name: string;
		readonly name_with_owner: string;
		readonly display_name?: string;
		readonly is_in_organization?: boolean;
		readonly license?: string;
		readonly opengraph_image_url?: string;
		readonly owner_avatar_url?: string;
		readonly primary_language?: string;
		readonly primary_language_color?: string;
		readonly pushed_at?: string;
		readonly stargazer_count?: number;
		readonly topics?: readonly string[];
		readonly uses_custom_opengraph_image?: boolean;
	}

	class Serializer implements IGalleryMcpServerDataSerializer {

		public toRawGalleryMcpServerResult(input: unknown): IRawGalleryMcpServersResult | undefined {
			if (!input || typeof input !== 'object' || !Array.isArray((input as RawGalleryMcpServersResult).servers)) {
				return undefined;
			}

			const from = <RawGalleryMcpServersResult>input;

			const servers: IRawGalleryMcpServer[] = [];
			for (const server of from.servers) {
				const rawServer = this.toRawGalleryMcpServer(server);
				if (!rawServer) {
					return undefined;
				}
				servers.push(rawServer);
			}

			return {
				metadata: {
					count: from.metadata.count ?? 0,
					nextCursor: from.metadata?.next_cursor
				},
				servers
			};
		}

		public toRawGalleryMcpServer(input: unknown): IRawGalleryMcpServer | undefined {
			if (!input || typeof input !== 'object') {
				return undefined;
			}

			const from = <RawGalleryMcpServer>input;

			if (
				(!from.name || !isString(from.name))
				|| (!from.description || !isString(from.description))
				|| (!from.version || !isString(from.version))
			) {
				return undefined;
			}

			if (from.$schema && from.$schema !== McpServerSchemaVersion_v2025_07_09.SCHEMA) {
				return undefined;
			}

			const registryInfo = from._meta?.['io.modelcontextprotocol.registry/official'];

			function convertServerInput(input: RawGalleryMcpServerInput): IMcpServerInput {
				return {
					...input,
					isRequired: input.is_required,
					isSecret: input.is_secret,
				};
			}

			function convertVariables(variables: Record<string, RawGalleryMcpServerInput>): Record<string, IMcpServerInput> {
				const result: Record<string, IMcpServerInput> = {};
				for (const [key, value] of Object.entries(variables)) {
					result[key] = convertServerInput(value);
				}
				return result;
			}

			function convertServerArgument(arg: RawGalleryMcpServerArgument): IMcpServerArgument {
				if (arg.type === 'positional') {
					return {
						...arg,
						valueHint: arg.value_hint,
						isRepeated: arg.is_repeated,
						isRequired: arg.is_required,
						isSecret: arg.is_secret,
						variables: arg.variables ? convertVariables(arg.variables) : undefined,
					};
				}
				return {
					...arg,
					isRepeated: arg.is_repeated,
					isRequired: arg.is_required,
					isSecret: arg.is_secret,
					variables: arg.variables ? convertVariables(arg.variables) : undefined,
				};
			}

			function convertKeyValueInput(input: RawGalleryMcpServerKeyValueInput): IMcpServerKeyValueInput {
				return {
					...input,
					isRequired: input.is_required,
					isSecret: input.is_secret,
					variables: input.variables ? convertVariables(input.variables) : undefined,
				};
			}

			function convertTransport(input: RawGalleryTransport): Transport {
				switch (input.type) {
					case 'stdio':
						return {
							type: TransportType.STDIO,
						};
					case 'streamable-http':
						return {
							type: TransportType.STREAMABLE_HTTP,
							url: input.url,
							headers: input.headers?.map(convertKeyValueInput),
						};
					case 'sse':
						return {
							type: TransportType.SSE,
							url: input.url,
							headers: input.headers?.map(convertKeyValueInput),
						};
					default:
						return {
							type: TransportType.STDIO,
						};
				}
			}

			function convertRegistryType(input: string): RegistryType {
				switch (input) {
					case 'npm':
						return RegistryType.NODE;
					case 'docker':
					case 'docker-hub':
					case 'oci':
						return RegistryType.DOCKER;
					case 'pypi':
						return RegistryType.PYTHON;
					case 'nuget':
						return RegistryType.NUGET;
					case 'mcpb':
						return RegistryType.MCPB;
					default:
						return RegistryType.NODE;
				}
			}

			const gitHubInfo: RawGitHubInfo | undefined = from._meta['io.modelcontextprotocol.registry/publisher-provided']?.github as RawGitHubInfo | undefined;

			return {
				id: registryInfo.id,
				name: from.name,
				description: from.description,
				repository: from.repository ? {
					url: from.repository.url,
					source: from.repository.source,
					id: from.repository.id,
				} : undefined,
				readme: from.repository?.readme,
				version: from.version,
				createdAt: from.created_at,
				updatedAt: from.updated_at,
				packages: from.packages?.map<IMcpServerPackage>(p => ({
					identifier: p.identifier ?? p.name,
					registryType: convertRegistryType(p.registry_type ?? p.registry_name),
					version: p.version,
					fileSha256: p.file_sha256,
					registryBaseUrl: p.registry_base_url,
					transport: p.transport ? convertTransport(p.transport) : { type: TransportType.STDIO },
					packageArguments: p.package_arguments?.map(convertServerArgument),
					runtimeHint: p.runtime_hint,
					runtimeArguments: p.runtime_arguments?.map(convertServerArgument),
					environmentVariables: p.environment_variables?.map(convertKeyValueInput),
				})),
				remotes: from.remotes?.map(remote => {
					const type = (<RawGalleryTransport>remote).type ?? (<McpServerDeprecatedRemote>remote).transport_type ?? (<McpServerDeprecatedRemote>remote).transport;
					return {
						type: type === TransportType.SSE ? TransportType.SSE : TransportType.STREAMABLE_HTTP,
						url: remote.url,
						headers: remote.headers?.map(convertKeyValueInput)
					};
				}),
				registryInfo: {
					isLatest: registryInfo.is_latest,
					publishedAt: registryInfo.published_at,
					updatedAt: registryInfo.updated_at,
				},
				githubInfo: gitHubInfo ? {
					name: gitHubInfo.name,
					nameWithOwner: gitHubInfo.name_with_owner,
					displayName: gitHubInfo.display_name,
					isInOrganization: gitHubInfo.is_in_organization,
					license: gitHubInfo.license,
					opengraphImageUrl: gitHubInfo.opengraph_image_url,
					ownerAvatarUrl: gitHubInfo.owner_avatar_url,
					primaryLanguage: gitHubInfo.primary_language,
					primaryLanguageColor: gitHubInfo.primary_language_color,
					pushedAt: gitHubInfo.pushed_at,
					stargazerCount: gitHubInfo.stargazer_count,
					topics: gitHubInfo.topics,
					usesCustomOpengraphImage: gitHubInfo.uses_custom_opengraph_image
				} : undefined
			};
		}
	}

	export const SERIALIZER = new Serializer();
}

namespace McpServerSchemaVersion_v0_1 {

	export const VERSION = 'v0.1';

	interface RawGalleryMcpServerInput {
		readonly choices?: readonly string[];
		readonly default?: string;
		readonly description?: string;
		readonly format?: 'string' | 'number' | 'boolean' | 'filepath';
		readonly isRequired?: boolean;
		readonly isSecret?: boolean;
		readonly placeholder?: string;
		readonly value?: string;
	}

	interface RawGalleryMcpServerVariableInput extends RawGalleryMcpServerInput {
		readonly variables?: Record<string, RawGalleryMcpServerInput>;
	}

	interface RawGalleryMcpServerPositionalArgument extends RawGalleryMcpServerVariableInput {
		readonly type: 'positional';
		readonly valueHint?: string;
		readonly isRepeated?: boolean;
	}

	interface RawGalleryMcpServerNamedArgument extends RawGalleryMcpServerVariableInput {
		readonly type: 'named';
		readonly name: string;
		readonly isRepeated?: boolean;
	}

	interface RawGalleryMcpServerKeyValueInput extends RawGalleryMcpServerVariableInput {
		readonly name: string;
	}

	type RawGalleryMcpServerArgument = RawGalleryMcpServerPositionalArgument | RawGalleryMcpServerNamedArgument;

	type RawGalleryMcpServerRemotes = ReadonlyArray<SseTransport | StreamableHttpTransport>;

	type RawGalleryTransport = StdioTransport | StreamableHttpTransport | SseTransport;

	interface StdioTransport {
		readonly type: TransportType.STDIO;
	}

	interface StreamableHttpTransport {
		readonly type: TransportType.STREAMABLE_HTTP;
		readonly url: string;
		readonly headers?: ReadonlyArray<RawGalleryMcpServerKeyValueInput>;
	}

	interface SseTransport {
		readonly type: TransportType.SSE;
		readonly url: string;
		readonly headers?: ReadonlyArray<RawGalleryMcpServerKeyValueInput>;
	}

	interface RawGalleryMcpServerPackage {
		readonly identifier: string;
		readonly registryType: RegistryType;
		readonly transport: RawGalleryTransport;
		readonly fileSha256?: string;
		readonly environmentVariables?: ReadonlyArray<RawGalleryMcpServerKeyValueInput>;
		readonly packageArguments?: readonly RawGalleryMcpServerArgument[];
		readonly registryBaseUrl?: string;
		readonly runtimeArguments?: readonly RawGalleryMcpServerArgument[];
		readonly runtimeHint?: string;
		readonly version?: string;
	}

	interface RawGalleryMcpServer {
		readonly name: string;
		readonly description: string;
		readonly version: string;
		readonly $schema: string;
		readonly title?: string;
		readonly icons?: IRawGalleryMcpServerIcon[];
		readonly repository?: {
			readonly source: string;
			readonly url: string;
			readonly subfolder?: string;
			readonly id?: string;
		};
		readonly websiteUrl?: string;
		readonly packages?: readonly RawGalleryMcpServerPackage[];
		readonly remotes?: RawGalleryMcpServerRemotes;
		readonly _meta?: {
			readonly 'io.modelcontextprotocol.registry/publisher-provided'?: Record<string, unknown>;
		} & IAzureAPICenterInfo;
	}

	interface RawGalleryMcpServerInfo {
		readonly server: RawGalleryMcpServer;
		readonly _meta: {
			readonly 'io.modelcontextprotocol.registry/official'?: {
				readonly status: GalleryMcpServerStatus;
				readonly isLatest: boolean;
				readonly publishedAt: string;
				readonly updatedAt?: string;
			};
		};
	}

	interface RawGalleryMcpServersResult {
		readonly metadata: {
			readonly count: number;
			readonly nextCursor?: string;
		};
		readonly servers: readonly RawGalleryMcpServerInfo[];
	}

	class Serializer implements IGalleryMcpServerDataSerializer {

		public toRawGalleryMcpServerResult(input: unknown): IRawGalleryMcpServersResult | undefined {
			if (!input || typeof input !== 'object' || !Array.isArray((input as RawGalleryMcpServersResult).servers)) {
				return undefined;
			}

			const from = <RawGalleryMcpServersResult>input;

			const servers: IRawGalleryMcpServer[] = [];
			for (const server of from.servers) {
				const rawServer = this.toRawGalleryMcpServer(server);
				if (!rawServer) {
					if (servers.length === 0) {
						return undefined;
					} else {
						continue;
					}
				}
				servers.push(rawServer);
			}

			return {
				metadata: from.metadata,
				servers
			};
		}

		public toRawGalleryMcpServer(input: unknown): IRawGalleryMcpServer | undefined {
			if (!input || typeof input !== 'object') {
				return undefined;
			}

			const from = <RawGalleryMcpServerInfo>input;

			if (
				(!from.server || !isObject(from.server))
				|| (!from.server.name || !isString(from.server.name))
				|| (!from.server.description || !isString(from.server.description))
				|| (!from.server.version || !isString(from.server.version))
			) {
				return undefined;
			}

			const { 'io.modelcontextprotocol.registry/official': registryInfo, ...apicInfo } = from._meta;
			const githubInfo = from.server._meta?.['io.modelcontextprotocol.registry/publisher-provided']?.github as IGitHubInfo | undefined;

			return {
				name: from.server.name,
				description: from.server.description,
				version: from.server.version,
				title: from.server.title,
				repository: from.server.repository ? {
					url: from.server.repository.url,
					source: from.server.repository.source,
					id: from.server.repository.id,
				} : undefined,
				readme: githubInfo?.readme,
				icons: from.server.icons,
				websiteUrl: from.server.websiteUrl,
				packages: from.server.packages,
				remotes: from.server.remotes,
				status: registryInfo?.status,
				registryInfo,
				githubInfo,
				apicInfo
			};
		}
	}

	export const SERIALIZER = new Serializer();
}

namespace McpServerSchemaVersion_v0 {

	export const VERSION = 'v0';

	class Serializer implements IGalleryMcpServerDataSerializer {

		private readonly galleryMcpServerDataSerializers: IGalleryMcpServerDataSerializer[] = [];

		constructor() {
			this.galleryMcpServerDataSerializers.push(McpServerSchemaVersion_v0_1.SERIALIZER);
			this.galleryMcpServerDataSerializers.push(McpServerSchemaVersion_v2025_07_09.SERIALIZER);
		}

		public toRawGalleryMcpServerResult(input: unknown): IRawGalleryMcpServersResult | undefined {
			for (const serializer of this.galleryMcpServerDataSerializers) {
				const result = serializer.toRawGalleryMcpServerResult(input);
				if (result) {
					return result;
				}
			}
			return undefined;
		}

		public toRawGalleryMcpServer(input: unknown): IRawGalleryMcpServer | undefined {
			for (const serializer of this.galleryMcpServerDataSerializers) {
				const result = serializer.toRawGalleryMcpServer(input);
				if (result) {
					return result;
				}
			}
			return undefined;
		}
	}

	export const SERIALIZER = new Serializer();
}

const DefaultPageSize = 50;

interface IQueryState {
	readonly searchText?: string;
	readonly cursor?: string;
	readonly pageSize: number;
}

const DefaultQueryState: IQueryState = {
	pageSize: DefaultPageSize,
};

class Query {

	constructor(private state = DefaultQueryState) { }

	get pageSize(): number { return this.state.pageSize; }
	get searchText(): string | undefined { return this.state.searchText; }
	get cursor(): string | undefined { return this.state.cursor; }

	withPage(cursor: string, pageSize: number = this.pageSize): Query {
		return new Query({ ...this.state, pageSize, cursor });
	}

	withSearchText(searchText: string | undefined): Query {
		return new Query({ ...this.state, searchText });
	}
}

export class McpGalleryService extends Disposable implements IMcpGalleryService {

	_serviceBrand: undefined;

	private galleryMcpServerDataSerializers: Map<string, IGalleryMcpServerDataSerializer>;

	constructor(
		@IRequestService private readonly requestService: IRequestService,
		@IFileService private readonly fileService: IFileService,
		@ILogService private readonly logService: ILogService,
		@IMcpGalleryManifestService private readonly mcpGalleryManifestService: IMcpGalleryManifestService,
	) {
		super();
		this.galleryMcpServerDataSerializers = new Map();
		this.galleryMcpServerDataSerializers.set(McpServerSchemaVersion_v0.VERSION, McpServerSchemaVersion_v0.SERIALIZER);
		this.galleryMcpServerDataSerializers.set(McpServerSchemaVersion_v0_1.VERSION, McpServerSchemaVersion_v0_1.SERIALIZER);
	}

	isEnabled(): boolean {
		return this.mcpGalleryManifestService.mcpGalleryManifestStatus === McpGalleryManifestStatus.Available;
	}

	async query(options?: IQueryOptions, token: CancellationToken = CancellationToken.None): Promise<IIterativePager<IGalleryMcpServer>> {
		const mcpGalleryManifest = await this.mcpGalleryManifestService.getMcpGalleryManifest();
		if (!mcpGalleryManifest) {
			return {
				firstPage: { items: [], hasMore: false },
				getNextPage: async () => ({ items: [], hasMore: false })
			};
		}

		let query = new Query();
		if (options?.text) {
			query = query.withSearchText(options.text.trim());
		}

		const { servers, metadata } = await this.queryGalleryMcpServers(query, mcpGalleryManifest, token);

		let currentCursor = metadata.nextCursor;
		return {
			firstPage: { items: servers, hasMore: !!metadata.nextCursor },
			getNextPage: async (ct: CancellationToken): Promise<IIterativePage<IGalleryMcpServer>> => {
				if (ct.isCancellationRequested) {
					throw new CancellationError();
				}
				if (!currentCursor) {
					return { items: [], hasMore: false };
				}
				const { servers, metadata: nextMetadata } = await this.queryGalleryMcpServers(query.withPage(currentCursor).withSearchText(undefined), mcpGalleryManifest, ct);
				currentCursor = nextMetadata.nextCursor;
				return { items: servers, hasMore: !!nextMetadata.nextCursor };
			}
		};
	}

	async getMcpServersFromGallery(infos: { name: string; id?: string }[]): Promise<IGalleryMcpServer[]> {
		const mcpGalleryManifest = await this.mcpGalleryManifestService.getMcpGalleryManifest();
		if (!mcpGalleryManifest) {
			return [];
		}

		const mcpServers: IGalleryMcpServer[] = [];
		await Promise.allSettled(infos.map(async info => {
			const mcpServer = await this.getMcpServerByName(info, mcpGalleryManifest);
			if (mcpServer) {
				mcpServers.push(mcpServer);
			}
		}));

		return mcpServers;
	}

	private async getMcpServerByName({ name, id }: { name: string; id?: string }, mcpGalleryManifest: IMcpGalleryManifest): Promise<IGalleryMcpServer | undefined> {
		const mcpServerUrl = this.getLatestServerVersionUrl(name, mcpGalleryManifest);
		if (mcpServerUrl) {
			const mcpServer = await this.getMcpServer(mcpServerUrl);
			if (mcpServer) {
				return mcpServer;
			}
		}

		const byNameUrl = this.getNamedServerUrl(name, mcpGalleryManifest);
		if (byNameUrl) {
			const mcpServer = await this.getMcpServer(byNameUrl);
			if (mcpServer) {
				return mcpServer;
			}
		}

		const byIdUrl = id ? this.getServerIdUrl(id, mcpGalleryManifest) : undefined;
		if (byIdUrl) {
			const mcpServer = await this.getMcpServer(byIdUrl);
			if (mcpServer) {
				return mcpServer;
			}
		}

		return undefined;
	}

	async getReadme(gallery: IGalleryMcpServer, token: CancellationToken): Promise<string> {
		const readmeUrl = gallery.readmeUrl;
		if (!readmeUrl) {
			return Promise.resolve(localize('noReadme', 'No README available'));
		}

		const uri = URI.parse(readmeUrl);
		if (uri.scheme === Schemas.file) {
			try {
				const content = await this.fileService.readFile(uri);
				return content.value.toString();
			} catch (error) {
				this.logService.error(`Failed to read file from ${uri}: ${error}`);
			}
		}

		if (uri.authority !== 'raw.githubusercontent.com') {
			return new MarkdownString(localize('readme.viewInBrowser', "You can find information about this server [here]({0})", readmeUrl)).value;
		}

		const context = await this.requestService.request({
			type: 'GET',
			url: readmeUrl,
		}, token);

		const result = await asText(context);
		if (!result) {
			throw new Error(`Failed to fetch README from ${readmeUrl}`);
		}

		return result;
	}

	private toGalleryMcpServer(server: IRawGalleryMcpServer, manifest: IMcpGalleryManifest | null): IGalleryMcpServer {
		let publisher = '';
		let displayName = server.title;

		if (server.githubInfo?.name) {
			if (!displayName) {
				displayName = server.githubInfo.name.split('-').map(s => s.toLowerCase() === 'mcp' ? 'MCP' : s.toLowerCase() === 'github' ? 'GitHub' : uppercaseFirstLetter(s)).join(' ');
			}
			publisher = server.githubInfo.nameWithOwner.split('/')[0];
		} else {
			const nameParts = server.name.split('/');
			if (nameParts.length > 0) {
				const domainParts = nameParts[0].split('.');
				if (domainParts.length > 0) {
					publisher = domainParts[domainParts.length - 1]; // Always take the last part as owner
				}
			}
			if (!displayName) {
				displayName = nameParts[nameParts.length - 1].split('-').map(s => uppercaseFirstLetter(s)).join(' ');
			}
		}

		if (server.githubInfo?.displayName) {
			displayName = server.githubInfo.displayName;
		}

		let icon: { light: string; dark: string } | undefined;

		if (server.githubInfo?.preferredImage) {
			icon = {
				light: server.githubInfo.preferredImage,
				dark: server.githubInfo.preferredImage
			};
		}

		else if (server.githubInfo?.ownerAvatarUrl) {
			icon = {
				light: server.githubInfo.ownerAvatarUrl,
				dark: server.githubInfo.ownerAvatarUrl
			};
		}

		else if (server.apicInfo?.['x-ms-icon']) {
			icon = {
				light: server.apicInfo['x-ms-icon'],
				dark: server.apicInfo['x-ms-icon']
			};
		}

		else if (server.icons && server.icons.length > 0) {
			const lightIcon = server.icons.find(icon => icon.theme === 'light') ?? server.icons[0];
			const darkIcon = server.icons.find(icon => icon.theme === 'dark') ?? lightIcon;
			icon = {
				light: lightIcon.src,
				dark: darkIcon.src
			};
		}

		const webUrl = manifest ? this.getWebUrl(server.name, manifest) : undefined;
		const publisherUrl = manifest ? this.getPublisherUrl(publisher, manifest) : undefined;

		return {
			id: server.id,
			name: server.name,
			displayName,
			galleryUrl: manifest?.url,
			webUrl,
			description: server.description,
			status: server.status ?? GalleryMcpServerStatus.Active,
			version: server.version,
			isLatest: server.registryInfo?.isLatest ?? true,
			publishDate: server.registryInfo?.publishedAt ? Date.parse(server.registryInfo.publishedAt) : undefined,
			lastUpdated: server.githubInfo?.pushedAt ? Date.parse(server.githubInfo.pushedAt) : server.registryInfo?.updatedAt ? Date.parse(server.registryInfo.updatedAt) : undefined,
			repositoryUrl: server.repository?.url,
			readme: server.readme,
			icon,
			publisher,
			publisherUrl,
			license: server.githubInfo?.license,
			starsCount: server.githubInfo?.stargazerCount,
			topics: server.githubInfo?.topics,
			configuration: {
				packages: server.packages,
				remotes: server.remotes
			}
		};
	}

	private async queryGalleryMcpServers(query: Query, mcpGalleryManifest: IMcpGalleryManifest, token: CancellationToken): Promise<IGalleryMcpServersResult> {
		const { servers, metadata } = await this.queryRawGalleryMcpServers(query, mcpGalleryManifest, token);
		return {
			servers: servers.map(item => this.toGalleryMcpServer(item, mcpGalleryManifest)),
			metadata
		};
	}

	private async queryRawGalleryMcpServers(query: Query, mcpGalleryManifest: IMcpGalleryManifest, token: CancellationToken): Promise<IRawGalleryMcpServersResult> {
		const mcpGalleryUrl = this.getMcpGalleryUrl(mcpGalleryManifest);
		if (!mcpGalleryUrl) {
			return { servers: [], metadata: { count: 0 } };
		}

		const uri = URI.parse(mcpGalleryUrl);
		if (uri.scheme === Schemas.file) {
			try {
				const content = await this.fileService.readFile(uri);
				const data = content.value.toString();
				return JSON.parse(data);
			} catch (error) {
				this.logService.error(`Failed to read file from ${uri}: ${error}`);
			}
		}

		let url = `${mcpGalleryUrl}?limit=${query.pageSize}&version=latest`;
		if (query.cursor) {
			url += `&cursor=${query.cursor}`;
		}
		if (query.searchText) {
			const text = encodeURIComponent(query.searchText);
			url += `&search=${text}`;
		}

		const context = await this.requestService.request({
			type: 'GET',
			url,
		}, token);

		const data = await asJson(context);

		if (!data) {
			return { servers: [], metadata: { count: 0 } };
		}

		const result = this.serializeMcpServersResult(data, mcpGalleryManifest);

		if (!result) {
			throw new Error(`Failed to serialize MCP servers result from ${mcpGalleryUrl}`, data);
		}

		return result;
	}

	async getMcpServer(mcpServerUrl: string, mcpGalleryManifest?: IMcpGalleryManifest | null): Promise<IGalleryMcpServer | undefined> {
		const context = await this.requestService.request({
			type: 'GET',
			url: mcpServerUrl,
		}, CancellationToken.None);

		if (context.res.statusCode && context.res.statusCode >= 400 && context.res.statusCode < 500) {
			return undefined;
		}

		const data = await asJson(context);
		if (!data) {
			return undefined;
		}

		if (!mcpGalleryManifest) {
			mcpGalleryManifest = await this.mcpGalleryManifestService.getMcpGalleryManifest();
		}
		mcpGalleryManifest = mcpGalleryManifest && mcpServerUrl.startsWith(mcpGalleryManifest.url) ? mcpGalleryManifest : null;

		const server = this.serializeMcpServer(data, mcpGalleryManifest);
		if (!server) {
			throw new Error(`Failed to serialize MCP server from ${mcpServerUrl}`, data);
		}

		return this.toGalleryMcpServer(server, mcpGalleryManifest);
	}

	private serializeMcpServer(data: unknown, mcpGalleryManifest: IMcpGalleryManifest | null): IRawGalleryMcpServer | undefined {
		return this.getSerializer(mcpGalleryManifest)?.toRawGalleryMcpServer(data);
	}

	private serializeMcpServersResult(data: unknown, mcpGalleryManifest: IMcpGalleryManifest | null): IRawGalleryMcpServersResult | undefined {
		return this.getSerializer(mcpGalleryManifest)?.toRawGalleryMcpServerResult(data);
	}

	private getSerializer(mcpGalleryManifest: IMcpGalleryManifest | null): IGalleryMcpServerDataSerializer | undefined {
		const version = mcpGalleryManifest?.version ?? 'v0';
		return this.galleryMcpServerDataSerializers.get(version);
	}

	private getNamedServerUrl(name: string, mcpGalleryManifest: IMcpGalleryManifest): string | undefined {
		const namedResourceUriTemplate = getMcpGalleryManifestResourceUri(mcpGalleryManifest, McpGalleryResourceType.McpServerNamedResourceUri);
		if (!namedResourceUriTemplate) {
			return undefined;
		}
		return format2(namedResourceUriTemplate, { name });
	}

	private getServerIdUrl(id: string, mcpGalleryManifest: IMcpGalleryManifest): string | undefined {
		const resourceUriTemplate = getMcpGalleryManifestResourceUri(mcpGalleryManifest, McpGalleryResourceType.McpServerIdUri);
		if (!resourceUriTemplate) {
			return undefined;
		}
		return format2(resourceUriTemplate, { id });
	}

	private getLatestServerVersionUrl(name: string, mcpGalleryManifest: IMcpGalleryManifest): string | undefined {
		const latestVersionResourceUriTemplate = getMcpGalleryManifestResourceUri(mcpGalleryManifest, McpGalleryResourceType.McpServerLatestVersionUri);
		if (!latestVersionResourceUriTemplate) {
			return undefined;
		}
		return format2(latestVersionResourceUriTemplate, { name: encodeURIComponent(name) });
	}

	private getWebUrl(name: string, mcpGalleryManifest: IMcpGalleryManifest): string | undefined {
		const resourceUriTemplate = getMcpGalleryManifestResourceUri(mcpGalleryManifest, McpGalleryResourceType.McpServerWebUri);
		if (!resourceUriTemplate) {
			return undefined;
		}
		return format2(resourceUriTemplate, { name });
	}

	private getPublisherUrl(name: string, mcpGalleryManifest: IMcpGalleryManifest): string | undefined {
		const resourceUriTemplate = getMcpGalleryManifestResourceUri(mcpGalleryManifest, McpGalleryResourceType.PublisherUriTemplate);
		if (!resourceUriTemplate) {
			return undefined;
		}
		return format2(resourceUriTemplate, { name });
	}

	private getMcpGalleryUrl(mcpGalleryManifest: IMcpGalleryManifest): string | undefined {
		return getMcpGalleryManifestResourceUri(mcpGalleryManifest, McpGalleryResourceType.McpServersQueryService);
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/mcp/common/mcpManagement.ts]---
Location: vscode-main/src/vs/platform/mcp/common/mcpManagement.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { Event } from '../../../base/common/event.js';
import { IMarkdownString } from '../../../base/common/htmlContent.js';
import { IIterativePager } from '../../../base/common/paging.js';
import { URI } from '../../../base/common/uri.js';
import { SortBy, SortOrder } from '../../extensionManagement/common/extensionManagement.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IMcpServerConfiguration, IMcpServerVariable } from './mcpPlatformTypes.js';

export type InstallSource = 'gallery' | 'local';

export interface ILocalMcpServer {
	readonly name: string;
	readonly config: IMcpServerConfiguration;
	readonly version?: string;
	readonly mcpResource: URI;
	readonly location?: URI;
	readonly displayName?: string;
	readonly description?: string;
	readonly galleryUrl?: string;
	readonly galleryId?: string;
	readonly repositoryUrl?: string;
	readonly readmeUrl?: URI;
	readonly publisher?: string;
	readonly publisherDisplayName?: string;
	readonly icon?: {
		readonly dark: string;
		readonly light: string;
	};
	readonly codicon?: string;
	readonly manifest?: IGalleryMcpServerConfiguration;
	readonly source: InstallSource;
}

export interface IMcpServerInput {
	readonly description?: string;
	readonly isRequired?: boolean;
	readonly format?: 'string' | 'number' | 'boolean' | 'filepath';
	readonly value?: string;
	readonly isSecret?: boolean;
	readonly default?: string;
	readonly choices?: readonly string[];
}

export interface IMcpServerVariableInput extends IMcpServerInput {
	readonly variables?: Record<string, IMcpServerInput>;
}

export interface IMcpServerPositionalArgument extends IMcpServerVariableInput {
	readonly type: 'positional';
	readonly valueHint?: string;
	readonly isRepeated?: boolean;
}

export interface IMcpServerNamedArgument extends IMcpServerVariableInput {
	readonly type: 'named';
	readonly name: string;
	readonly isRepeated?: boolean;
}

export interface IMcpServerKeyValueInput extends IMcpServerVariableInput {
	readonly name: string;
	readonly value?: string;
}

export type IMcpServerArgument = IMcpServerPositionalArgument | IMcpServerNamedArgument;

export const enum RegistryType {
	NODE = 'npm',
	PYTHON = 'pypi',
	DOCKER = 'oci',
	NUGET = 'nuget',
	MCPB = 'mcpb',
	REMOTE = 'remote'
}

export const enum TransportType {
	STDIO = 'stdio',
	STREAMABLE_HTTP = 'streamable-http',
	SSE = 'sse'
}

export interface StdioTransport {
	readonly type: TransportType.STDIO;
}

export interface StreamableHttpTransport {
	readonly type: TransportType.STREAMABLE_HTTP;
	readonly url: string;
	readonly headers?: ReadonlyArray<IMcpServerKeyValueInput>;
}

export interface SseTransport {
	readonly type: TransportType.SSE;
	readonly url: string;
	readonly headers?: ReadonlyArray<IMcpServerKeyValueInput>;
}

export type Transport = StdioTransport | StreamableHttpTransport | SseTransport;

export interface IMcpServerPackage {
	readonly registryType: RegistryType;
	readonly identifier: string;
	readonly transport: Transport;
	readonly version?: string;
	readonly registryBaseUrl?: string;
	readonly fileSha256?: string;
	readonly packageArguments?: readonly IMcpServerArgument[];
	readonly runtimeHint?: string;
	readonly runtimeArguments?: readonly IMcpServerArgument[];
	readonly environmentVariables?: ReadonlyArray<IMcpServerKeyValueInput>;
}

export interface IGalleryMcpServerConfiguration {
	readonly packages?: readonly IMcpServerPackage[];
	readonly remotes?: ReadonlyArray<SseTransport | StreamableHttpTransport>;
}

export const enum GalleryMcpServerStatus {
	Active = 'active',
	Deprecated = 'deprecated'
}

export interface IGalleryMcpServer {
	readonly name: string;
	readonly displayName: string;
	readonly description: string;
	readonly version: string;
	readonly isLatest: boolean;
	readonly status: GalleryMcpServerStatus;
	readonly id?: string;
	readonly galleryUrl?: string;
	readonly webUrl?: string;
	readonly codicon?: string;
	readonly icon?: {
		readonly dark: string;
		readonly light: string;
	};
	readonly lastUpdated?: number;
	readonly publishDate?: number;
	readonly repositoryUrl?: string;
	readonly configuration: IGalleryMcpServerConfiguration;
	readonly readmeUrl?: string;
	readonly readme?: string;
	readonly publisher: string;
	readonly publisherDisplayName?: string;
	readonly publisherUrl?: string;
	readonly publisherDomain?: { link: string; verified: boolean };
	readonly ratingCount?: number;
	readonly topics?: readonly string[];
	readonly license?: string;
	readonly starsCount?: number;
}

export interface IQueryOptions {
	text?: string;
	sortBy?: SortBy;
	sortOrder?: SortOrder;
}

export const IMcpGalleryService = createDecorator<IMcpGalleryService>('IMcpGalleryService');
export interface IMcpGalleryService {
	readonly _serviceBrand: undefined;
	isEnabled(): boolean;
	query(options?: IQueryOptions, token?: CancellationToken): Promise<IIterativePager<IGalleryMcpServer>>;
	getMcpServersFromGallery(infos: { name: string; id?: string }[]): Promise<IGalleryMcpServer[]>;
	getMcpServer(url: string): Promise<IGalleryMcpServer | undefined>;
	getReadme(extension: IGalleryMcpServer, token: CancellationToken): Promise<string>;
}

export interface InstallMcpServerEvent {
	readonly name: string;
	readonly mcpResource: URI;
	readonly source?: IGalleryMcpServer;
}

export interface InstallMcpServerResult {
	readonly name: string;
	readonly mcpResource: URI;
	readonly source?: IGalleryMcpServer;
	readonly local?: ILocalMcpServer;
	readonly error?: Error;
}

export interface UninstallMcpServerEvent {
	readonly name: string;
	readonly mcpResource: URI;
}

export interface DidUninstallMcpServerEvent {
	readonly name: string;
	readonly mcpResource: URI;
	readonly error?: string;
}

export type InstallOptions = {
	packageType?: RegistryType;
	mcpResource?: URI;
};

export type UninstallOptions = {
	mcpResource?: URI;
};

export interface IInstallableMcpServer {
	readonly name: string;
	readonly config: IMcpServerConfiguration;
	readonly inputs?: IMcpServerVariable[];
}

export type McpServerConfiguration = Omit<IInstallableMcpServer, 'name'>;
export interface McpServerConfigurationParseResult {
	readonly mcpServerConfiguration: McpServerConfiguration;
	readonly notices: string[];
}

export const IMcpManagementService = createDecorator<IMcpManagementService>('IMcpManagementService');
export interface IMcpManagementService {
	readonly _serviceBrand: undefined;
	readonly onInstallMcpServer: Event<InstallMcpServerEvent>;
	readonly onDidInstallMcpServers: Event<readonly InstallMcpServerResult[]>;
	readonly onDidUpdateMcpServers: Event<readonly InstallMcpServerResult[]>;
	readonly onUninstallMcpServer: Event<UninstallMcpServerEvent>;
	readonly onDidUninstallMcpServer: Event<DidUninstallMcpServerEvent>;
	getInstalled(mcpResource?: URI): Promise<ILocalMcpServer[]>;
	canInstall(server: IGalleryMcpServer | IInstallableMcpServer): true | IMarkdownString;
	install(server: IInstallableMcpServer, options?: InstallOptions): Promise<ILocalMcpServer>;
	installFromGallery(server: IGalleryMcpServer, options?: InstallOptions): Promise<ILocalMcpServer>;
	updateMetadata(local: ILocalMcpServer, server: IGalleryMcpServer, profileLocation?: URI): Promise<ILocalMcpServer>;
	uninstall(server: ILocalMcpServer, options?: UninstallOptions): Promise<void>;

	getMcpServerConfigurationFromManifest(manifest: IGalleryMcpServerConfiguration, packageType: RegistryType): McpServerConfigurationParseResult;
}

export const IAllowedMcpServersService = createDecorator<IAllowedMcpServersService>('IAllowedMcpServersService');
export interface IAllowedMcpServersService {
	readonly _serviceBrand: undefined;

	readonly onDidChangeAllowedMcpServers: Event<void>;
	isAllowed(mcpServer: IGalleryMcpServer | ILocalMcpServer | IInstallableMcpServer): true | IMarkdownString;
}

export const mcpAccessConfig = 'chat.mcp.access';
export const mcpGalleryServiceUrlConfig = 'chat.mcp.gallery.serviceUrl';
export const mcpGalleryServiceEnablementConfig = 'chat.mcp.gallery.enabled';
export const mcpAutoStartConfig = 'chat.mcp.autostart';

export interface IMcpGalleryConfig {
	readonly serviceUrl?: string;
	readonly enabled?: boolean;
	readonly version?: string;
}

export const enum McpAutoStartValue {
	Never = 'never',
	OnlyNew = 'onlyNew',
	NewAndOutdated = 'newAndOutdated',
}

export const enum McpAccessValue {
	None = 'none',
	Registry = 'registry',
	All = 'all',
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/mcp/common/mcpManagementCli.ts]---
Location: vscode-main/src/vs/platform/mcp/common/mcpManagementCli.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILogger } from '../../log/common/log.js';
import { IMcpServerConfiguration, IMcpServerVariable } from './mcpPlatformTypes.js';
import { IMcpManagementService } from './mcpManagement.js';

type ValidatedConfig = { name: string; config: IMcpServerConfiguration; inputs?: IMcpServerVariable[] };

export class McpManagementCli {
	constructor(
		private readonly _logger: ILogger,
		@IMcpManagementService private readonly _mcpManagementService: IMcpManagementService,
	) { }

	async addMcpDefinitions(
		definitions: string[],
	) {
		const configs = definitions.map((config) => this.validateConfiguration(config));
		await this.updateMcpInResource(configs);
		this._logger.info(`Added MCP servers: ${configs.map(c => c.name).join(', ')}`);
	}

	private async updateMcpInResource(configs: ValidatedConfig[]) {
		await Promise.all(configs.map(({ name, config, inputs }) => this._mcpManagementService.install({ name, config, inputs })));
	}

	private validateConfiguration(config: string): ValidatedConfig {
		let parsed: IMcpServerConfiguration & { name: string; inputs?: IMcpServerVariable[] };
		try {
			parsed = JSON.parse(config);
		} catch (e) {
			throw new InvalidMcpOperationError(`Invalid JSON '${config}': ${e}`);
		}

		if (!parsed.name) {
			throw new InvalidMcpOperationError(`Missing name property in ${config}`);
		}

		if (!('command' in parsed) && !('url' in parsed)) {
			throw new InvalidMcpOperationError(`Missing command or URL property in ${config}`);
		}

		const { name, inputs, ...rest } = parsed;
		return { name, inputs, config: rest as IMcpServerConfiguration };
	}
}

class InvalidMcpOperationError extends Error {
	constructor(message: string) {
		super(message);
		this.stack = message;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/mcp/common/mcpManagementIpc.ts]---
Location: vscode-main/src/vs/platform/mcp/common/mcpManagementIpc.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { cloneAndChange } from '../../../base/common/objects.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { DefaultURITransformer, IURITransformer, transformAndReviveIncomingURIs } from '../../../base/common/uriIpc.js';
import { IChannel, IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import { ILogService } from '../../log/common/log.js';
import { RemoteAgentConnectionContext } from '../../remote/common/remoteAgentEnvironment.js';
import { DidUninstallMcpServerEvent, IGalleryMcpServer, ILocalMcpServer, IMcpManagementService, IInstallableMcpServer, InstallMcpServerEvent, InstallMcpServerResult, InstallOptions, UninstallMcpServerEvent, UninstallOptions, IAllowedMcpServersService } from './mcpManagement.js';
import { AbstractMcpManagementService } from './mcpManagementService.js';

function transformIncomingURI(uri: UriComponents, transformer: IURITransformer | null): URI;
function transformIncomingURI(uri: UriComponents | undefined, transformer: IURITransformer | null): URI | undefined;
function transformIncomingURI(uri: UriComponents | undefined, transformer: IURITransformer | null): URI | undefined {
	return uri ? URI.revive(transformer ? transformer.transformIncoming(uri) : uri) : undefined;
}

function transformIncomingServer(mcpServer: ILocalMcpServer, transformer: IURITransformer | null): ILocalMcpServer {
	transformer = transformer ? transformer : DefaultURITransformer;
	const manifest = mcpServer.manifest;
	const transformed = transformAndReviveIncomingURIs({ ...mcpServer, ...{ manifest: undefined } }, transformer);
	return { ...transformed, ...{ manifest } };
}

function transformIncomingOptions<O extends { mcpResource?: UriComponents }>(options: O | undefined, transformer: IURITransformer | null): O | undefined {
	return options?.mcpResource ? transformAndReviveIncomingURIs(options, transformer ?? DefaultURITransformer) : options;
}

function transformOutgoingExtension(extension: ILocalMcpServer, transformer: IURITransformer | null): ILocalMcpServer {
	return transformer ? cloneAndChange(extension, value => value instanceof URI ? transformer.transformOutgoingURI(value) : undefined) : extension;
}

function transformOutgoingURI(uri: URI, transformer: IURITransformer | null): URI {
	return transformer ? transformer.transformOutgoingURI(uri) : uri;
}

export class McpManagementChannel<TContext = RemoteAgentConnectionContext | string> implements IServerChannel<TContext> {
	readonly onInstallMcpServer: Event<InstallMcpServerEvent>;
	readonly onDidInstallMcpServers: Event<readonly InstallMcpServerResult[]>;
	readonly onDidUpdateMcpServers: Event<readonly InstallMcpServerResult[]>;
	readonly onUninstallMcpServer: Event<UninstallMcpServerEvent>;
	readonly onDidUninstallMcpServer: Event<DidUninstallMcpServerEvent>;

	constructor(private service: IMcpManagementService, private getUriTransformer: (requestContext: TContext) => IURITransformer | null) {
		this.onInstallMcpServer = Event.buffer(service.onInstallMcpServer, true);
		this.onDidInstallMcpServers = Event.buffer(service.onDidInstallMcpServers, true);
		this.onDidUpdateMcpServers = Event.buffer(service.onDidUpdateMcpServers, true);
		this.onUninstallMcpServer = Event.buffer(service.onUninstallMcpServer, true);
		this.onDidUninstallMcpServer = Event.buffer(service.onDidUninstallMcpServer, true);
	}

	listen<T>(context: TContext, event: string): Event<T> {
		const uriTransformer = this.getUriTransformer(context);
		switch (event) {
			case 'onInstallMcpServer': {
				return Event.map<InstallMcpServerEvent, InstallMcpServerEvent>(this.onInstallMcpServer, event => {
					return { ...event, mcpResource: transformOutgoingURI(event.mcpResource, uriTransformer) };
				}) as Event<T>;
			}
			case 'onDidInstallMcpServers': {
				return Event.map<readonly InstallMcpServerResult[], readonly InstallMcpServerResult[]>(this.onDidInstallMcpServers, results =>
					results.map(i => ({
						...i,
						local: i.local ? transformOutgoingExtension(i.local, uriTransformer) : i.local,
						mcpResource: transformOutgoingURI(i.mcpResource, uriTransformer)
					}))) as Event<T>;
			}
			case 'onDidUpdateMcpServers': {
				return Event.map<readonly InstallMcpServerResult[], readonly InstallMcpServerResult[]>(this.onDidUpdateMcpServers, results =>
					results.map(i => ({
						...i,
						local: i.local ? transformOutgoingExtension(i.local, uriTransformer) : i.local,
						mcpResource: transformOutgoingURI(i.mcpResource, uriTransformer)
					}))) as Event<T>;
			}
			case 'onUninstallMcpServer': {
				return Event.map<UninstallMcpServerEvent, UninstallMcpServerEvent>(this.onUninstallMcpServer, event => {
					return { ...event, mcpResource: transformOutgoingURI(event.mcpResource, uriTransformer) };
				}) as Event<T>;
			}
			case 'onDidUninstallMcpServer': {
				return Event.map<DidUninstallMcpServerEvent, DidUninstallMcpServerEvent>(this.onDidUninstallMcpServer, event => {
					return { ...event, mcpResource: transformOutgoingURI(event.mcpResource, uriTransformer) };
				}) as Event<T>;
			}
		}

		throw new Error('Invalid listen');
	}

	async call<T>(context: TContext, command: string, args?: unknown): Promise<T> {
		const uriTransformer: IURITransformer | null = this.getUriTransformer(context);
		const argsArray = Array.isArray(args) ? args : [];
		switch (command) {
			case 'getInstalled': {
				const mcpServers = await this.service.getInstalled(transformIncomingURI(argsArray[0], uriTransformer));
				return mcpServers.map(e => transformOutgoingExtension(e, uriTransformer)) as T;
			}
			case 'install': {
				return this.service.install(argsArray[0], transformIncomingOptions(argsArray[1], uriTransformer)) as T;
			}
			case 'installFromGallery': {
				return this.service.installFromGallery(argsArray[0], transformIncomingOptions(argsArray[1], uriTransformer)) as T;
			}
			case 'uninstall': {
				return this.service.uninstall(transformIncomingServer(argsArray[0], uriTransformer), transformIncomingOptions(argsArray[1], uriTransformer)) as T;
			}
			case 'updateMetadata': {
				return this.service.updateMetadata(transformIncomingServer(argsArray[0], uriTransformer), argsArray[1], transformIncomingURI(argsArray[2], uriTransformer)) as T;
			}
		}

		throw new Error('Invalid call');
	}
}

export class McpManagementChannelClient extends AbstractMcpManagementService implements IMcpManagementService {

	declare readonly _serviceBrand: undefined;

	private readonly _onInstallMcpServer = this._register(new Emitter<InstallMcpServerEvent>());
	get onInstallMcpServer() { return this._onInstallMcpServer.event; }

	private readonly _onDidInstallMcpServers = this._register(new Emitter<readonly InstallMcpServerResult[]>());
	get onDidInstallMcpServers() { return this._onDidInstallMcpServers.event; }

	private readonly _onUninstallMcpServer = this._register(new Emitter<UninstallMcpServerEvent>());
	get onUninstallMcpServer() { return this._onUninstallMcpServer.event; }

	private readonly _onDidUninstallMcpServer = this._register(new Emitter<DidUninstallMcpServerEvent>());
	get onDidUninstallMcpServer() { return this._onDidUninstallMcpServer.event; }

	private readonly _onDidUpdateMcpServers = this._register(new Emitter<InstallMcpServerResult[]>());
	get onDidUpdateMcpServers() { return this._onDidUpdateMcpServers.event; }

	constructor(
		private readonly channel: IChannel,
		@IAllowedMcpServersService allowedMcpServersService: IAllowedMcpServersService,
		@ILogService logService: ILogService
	) {
		super(allowedMcpServersService, logService);
		this._register(this.channel.listen<InstallMcpServerEvent>('onInstallMcpServer')(e => this._onInstallMcpServer.fire(({ ...e, mcpResource: transformIncomingURI(e.mcpResource, null) }))));
		this._register(this.channel.listen<readonly InstallMcpServerResult[]>('onDidInstallMcpServers')(results => this._onDidInstallMcpServers.fire(results.map(e => ({ ...e, local: e.local ? transformIncomingServer(e.local, null) : e.local, mcpResource: transformIncomingURI(e.mcpResource, null) })))));
		this._register(this.channel.listen<readonly InstallMcpServerResult[]>('onDidUpdateMcpServers')(results => this._onDidUpdateMcpServers.fire(results.map(e => ({ ...e, local: e.local ? transformIncomingServer(e.local, null) : e.local, mcpResource: transformIncomingURI(e.mcpResource, null) })))));
		this._register(this.channel.listen<UninstallMcpServerEvent>('onUninstallMcpServer')(e => this._onUninstallMcpServer.fire(({ ...e, mcpResource: transformIncomingURI(e.mcpResource, null) }))));
		this._register(this.channel.listen<DidUninstallMcpServerEvent>('onDidUninstallMcpServer')(e => this._onDidUninstallMcpServer.fire(({ ...e, mcpResource: transformIncomingURI(e.mcpResource, null) }))));
	}

	install(server: IInstallableMcpServer, options?: InstallOptions): Promise<ILocalMcpServer> {
		return Promise.resolve(this.channel.call<ILocalMcpServer>('install', [server, options])).then(local => transformIncomingServer(local, null));
	}

	installFromGallery(extension: IGalleryMcpServer, installOptions?: InstallOptions): Promise<ILocalMcpServer> {
		return Promise.resolve(this.channel.call<ILocalMcpServer>('installFromGallery', [extension, installOptions])).then(local => transformIncomingServer(local, null));
	}

	uninstall(extension: ILocalMcpServer, options?: UninstallOptions): Promise<void> {
		return Promise.resolve(this.channel.call<void>('uninstall', [extension, options]));
	}

	getInstalled(mcpResource?: URI): Promise<ILocalMcpServer[]> {
		return Promise.resolve(this.channel.call<ILocalMcpServer[]>('getInstalled', [mcpResource]))
			.then(servers => servers.map(server => transformIncomingServer(server, null)));
	}

	updateMetadata(local: ILocalMcpServer, gallery: IGalleryMcpServer, mcpResource?: URI): Promise<ILocalMcpServer> {
		return Promise.resolve(this.channel.call<ILocalMcpServer>('updateMetadata', [local, gallery, mcpResource])).then(local => transformIncomingServer(local, null));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/mcp/common/mcpManagementService.ts]---
Location: vscode-main/src/vs/platform/mcp/common/mcpManagementService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RunOnceScheduler } from '../../../base/common/async.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { IMarkdownString, MarkdownString } from '../../../base/common/htmlContent.js';
import { Disposable, DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../base/common/map.js';
import { equals } from '../../../base/common/objects.js';
import { isString } from '../../../base/common/types.js';
import { URI } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { ConfigurationTarget } from '../../configuration/common/configuration.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { IFileService } from '../../files/common/files.js';
import { IInstantiationService } from '../../instantiation/common/instantiation.js';
import { ILogService } from '../../log/common/log.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';
import { DidUninstallMcpServerEvent, IGalleryMcpServer, ILocalMcpServer, IMcpGalleryService, IMcpManagementService, IMcpServerInput, IGalleryMcpServerConfiguration, InstallMcpServerEvent, InstallMcpServerResult, RegistryType, UninstallMcpServerEvent, InstallOptions, UninstallOptions, IInstallableMcpServer, IAllowedMcpServersService, IMcpServerArgument, IMcpServerKeyValueInput, McpServerConfigurationParseResult } from './mcpManagement.js';
import { IMcpServerVariable, McpServerVariableType, IMcpServerConfiguration, McpServerType } from './mcpPlatformTypes.js';
import { IMcpResourceScannerService, McpResourceTarget } from './mcpResourceScannerService.js';

export interface ILocalMcpServerInfo {
	name: string;
	version?: string;
	displayName?: string;
	galleryId?: string;
	galleryUrl?: string;
	description?: string;
	repositoryUrl?: string;
	publisher?: string;
	publisherDisplayName?: string;
	icon?: {
		dark: string;
		light: string;
	};
	codicon?: string;
	manifest?: IGalleryMcpServerConfiguration;
	readmeUrl?: URI;
	location?: URI;
	licenseUrl?: string;
}

export abstract class AbstractCommonMcpManagementService extends Disposable implements IMcpManagementService {

	_serviceBrand: undefined;

	abstract onInstallMcpServer: Event<InstallMcpServerEvent>;
	abstract onDidInstallMcpServers: Event<readonly InstallMcpServerResult[]>;
	abstract onDidUpdateMcpServers: Event<readonly InstallMcpServerResult[]>;
	abstract onUninstallMcpServer: Event<UninstallMcpServerEvent>;
	abstract onDidUninstallMcpServer: Event<DidUninstallMcpServerEvent>;

	abstract getInstalled(mcpResource?: URI): Promise<ILocalMcpServer[]>;
	abstract install(server: IInstallableMcpServer, options?: InstallOptions): Promise<ILocalMcpServer>;
	abstract installFromGallery(server: IGalleryMcpServer, options?: InstallOptions): Promise<ILocalMcpServer>;
	abstract updateMetadata(local: ILocalMcpServer, server: IGalleryMcpServer, profileLocation?: URI): Promise<ILocalMcpServer>;
	abstract uninstall(server: ILocalMcpServer, options?: UninstallOptions): Promise<void>;
	abstract canInstall(server: IGalleryMcpServer | IInstallableMcpServer): true | IMarkdownString;

	constructor(
		@ILogService protected readonly logService: ILogService
	) {
		super();
	}

	getMcpServerConfigurationFromManifest(manifest: IGalleryMcpServerConfiguration, packageType: RegistryType): McpServerConfigurationParseResult {

		// remote
		if (packageType === RegistryType.REMOTE && manifest.remotes?.length) {
			const { inputs, variables } = this.processKeyValueInputs(manifest.remotes[0].headers ?? []);
			return {
				mcpServerConfiguration: {
					config: {
						type: McpServerType.REMOTE,
						url: manifest.remotes[0].url,
						headers: Object.keys(inputs).length ? inputs : undefined,
					},
					inputs: variables.length ? variables : undefined,
				},
				notices: [],
			};
		}

		// local
		const serverPackage = manifest.packages?.find(p => p.registryType === packageType) ?? manifest.packages?.[0];
		if (!serverPackage) {
			throw new Error(`No server package found`);
		}

		const args: string[] = [];
		const inputs: IMcpServerVariable[] = [];
		const env: Record<string, string> = {};
		const notices: string[] = [];

		if (serverPackage.registryType === RegistryType.DOCKER) {
			args.push('run');
			args.push('-i');
			args.push('--rm');
		}

		if (serverPackage.runtimeArguments?.length) {
			const result = this.processArguments(serverPackage.runtimeArguments ?? []);
			args.push(...result.args);
			inputs.push(...result.variables);
			notices.push(...result.notices);
		}

		if (serverPackage.environmentVariables?.length) {
			const { inputs: envInputs, variables: envVariables, notices: envNotices } = this.processKeyValueInputs(serverPackage.environmentVariables ?? []);
			inputs.push(...envVariables);
			notices.push(...envNotices);
			for (const [name, value] of Object.entries(envInputs)) {
				env[name] = value;
				if (serverPackage.registryType === RegistryType.DOCKER) {
					args.push('-e');
					args.push(name);
				}
			}
		}

		switch (serverPackage.registryType) {
			case RegistryType.NODE:
				args.push(serverPackage.version ? `${serverPackage.identifier}@${serverPackage.version}` : serverPackage.identifier);
				break;
			case RegistryType.PYTHON:
				args.push(serverPackage.version ? `${serverPackage.identifier}==${serverPackage.version}` : serverPackage.identifier);
				break;
			case RegistryType.DOCKER:
				args.push(serverPackage.version ? `${serverPackage.identifier}:${serverPackage.version}` : serverPackage.identifier);
				break;
			case RegistryType.NUGET:
				args.push(serverPackage.version ? `${serverPackage.identifier}@${serverPackage.version}` : serverPackage.identifier);
				args.push('--yes'); // installation is confirmed by the UI, so --yes is appropriate here
				if (serverPackage.packageArguments?.length) {
					args.push('--');
				}
				break;
		}

		if (serverPackage.packageArguments?.length) {
			const result = this.processArguments(serverPackage.packageArguments);
			args.push(...result.args);
			inputs.push(...result.variables);
			notices.push(...result.notices);
		}

		return {
			notices,
			mcpServerConfiguration: {
				config: {
					type: McpServerType.LOCAL,
					command: this.getCommandName(serverPackage.registryType),
					args: args.length ? args : undefined,
					env: Object.keys(env).length ? env : undefined,
				},
				inputs: inputs.length ? inputs : undefined,
			}
		};
	}

	protected getCommandName(packageType: RegistryType): string {
		switch (packageType) {
			case RegistryType.NODE: return 'npx';
			case RegistryType.DOCKER: return 'docker';
			case RegistryType.PYTHON: return 'uvx';
			case RegistryType.NUGET: return 'dnx';
		}
		return packageType;
	}

	protected getVariables(variableInputs: Record<string, IMcpServerInput>): IMcpServerVariable[] {
		const variables: IMcpServerVariable[] = [];
		for (const [key, value] of Object.entries(variableInputs)) {
			variables.push({
				id: key,
				type: value.choices ? McpServerVariableType.PICK : McpServerVariableType.PROMPT,
				description: value.description ?? '',
				password: !!value.isSecret,
				default: value.default,
				options: value.choices,
			});
		}
		return variables;
	}

	private processKeyValueInputs(keyValueInputs: ReadonlyArray<IMcpServerKeyValueInput>): { inputs: Record<string, string>; variables: IMcpServerVariable[]; notices: string[] } {
		const notices: string[] = [];
		const inputs: Record<string, string> = {};
		const variables: IMcpServerVariable[] = [];

		for (const input of keyValueInputs) {
			const inputVariables = input.variables ? this.getVariables(input.variables) : [];
			let value = input.value || '';

			// If explicit variables exist, use them regardless of value
			if (inputVariables.length) {
				for (const variable of inputVariables) {
					value = value.replace(`{${variable.id}}`, `\${input:${variable.id}}`);
				}
				variables.push(...inputVariables);
			} else if (!value && (input.description || input.choices || input.default !== undefined)) {
				// Only create auto-generated input variable if no explicit variables and no value
				variables.push({
					id: input.name,
					type: input.choices ? McpServerVariableType.PICK : McpServerVariableType.PROMPT,
					description: input.description ?? '',
					password: !!input.isSecret,
					default: input.default,
					options: input.choices,
				});
				value = `\${input:${input.name}}`;
			}

			inputs[input.name] = value;
		}

		return { inputs, variables, notices };
	}

	private processArguments(argumentsList: readonly IMcpServerArgument[]): { args: string[]; variables: IMcpServerVariable[]; notices: string[] } {
		const args: string[] = [];
		const variables: IMcpServerVariable[] = [];
		const notices: string[] = [];
		for (const arg of argumentsList) {
			const argVariables = arg.variables ? this.getVariables(arg.variables) : [];

			if (arg.type === 'positional') {
				let value = arg.value;
				if (value) {
					for (const variable of argVariables) {
						value = value.replace(`{${variable.id}}`, `\${input:${variable.id}}`);
					}
					args.push(value);
					if (argVariables.length) {
						variables.push(...argVariables);
					}
				} else if (arg.valueHint && (arg.description || arg.default !== undefined)) {
					// Create input variable for positional argument without value
					variables.push({
						id: arg.valueHint,
						type: McpServerVariableType.PROMPT,
						description: arg.description ?? '',
						password: false,
						default: arg.default,
					});
					args.push(`\${input:${arg.valueHint}}`);
				} else {
					// Fallback to value_hint as literal
					args.push(arg.valueHint ?? '');
				}
			} else if (arg.type === 'named') {
				if (!arg.name) {
					notices.push(`Named argument is missing a name. ${JSON.stringify(arg)}`);
					continue;
				}
				args.push(arg.name);
				if (arg.value) {
					let value = arg.value;
					for (const variable of argVariables) {
						value = value.replace(`{${variable.id}}`, `\${input:${variable.id}}`);
					}
					args.push(value);
					if (argVariables.length) {
						variables.push(...argVariables);
					}
				} else if (arg.description || arg.default !== undefined) {
					// Create input variable for named argument without value
					const variableId = arg.name.replace(/^--?/, '');
					variables.push({
						id: variableId,
						type: McpServerVariableType.PROMPT,
						description: arg.description ?? '',
						password: false,
						default: arg.default,
					});
					args.push(`\${input:${variableId}}`);
				}
			}
		}
		return { args, variables, notices };
	}

}

export abstract class AbstractMcpResourceManagementService extends AbstractCommonMcpManagementService {

	private initializePromise: Promise<void> | undefined;
	private readonly reloadConfigurationScheduler: RunOnceScheduler;
	private local = new Map<string, ILocalMcpServer>();

	protected readonly _onInstallMcpServer = this._register(new Emitter<InstallMcpServerEvent>());
	readonly onInstallMcpServer = this._onInstallMcpServer.event;

	protected readonly _onDidInstallMcpServers = this._register(new Emitter<InstallMcpServerResult[]>());
	get onDidInstallMcpServers() { return this._onDidInstallMcpServers.event; }

	protected readonly _onDidUpdateMcpServers = this._register(new Emitter<InstallMcpServerResult[]>());
	get onDidUpdateMcpServers() { return this._onDidUpdateMcpServers.event; }

	protected readonly _onUninstallMcpServer = this._register(new Emitter<UninstallMcpServerEvent>());
	get onUninstallMcpServer() { return this._onUninstallMcpServer.event; }

	protected _onDidUninstallMcpServer = this._register(new Emitter<DidUninstallMcpServerEvent>());
	get onDidUninstallMcpServer() { return this._onDidUninstallMcpServer.event; }

	constructor(
		protected readonly mcpResource: URI,
		protected readonly target: McpResourceTarget,
		@IMcpGalleryService protected readonly mcpGalleryService: IMcpGalleryService,
		@IFileService protected readonly fileService: IFileService,
		@IUriIdentityService protected readonly uriIdentityService: IUriIdentityService,
		@ILogService logService: ILogService,
		@IMcpResourceScannerService protected readonly mcpResourceScannerService: IMcpResourceScannerService,
	) {
		super(logService);
		this.reloadConfigurationScheduler = this._register(new RunOnceScheduler(() => this.updateLocal(), 50));
	}

	private initialize(): Promise<void> {
		if (!this.initializePromise) {
			this.initializePromise = (async () => {
				try {
					this.local = await this.populateLocalServers();
				} finally {
					this.startWatching();
				}
			})();
		}
		return this.initializePromise;
	}

	private async populateLocalServers(): Promise<Map<string, ILocalMcpServer>> {
		this.logService.trace('AbstractMcpResourceManagementService#populateLocalServers', this.mcpResource.toString());
		const local = new Map<string, ILocalMcpServer>();
		try {
			const scannedMcpServers = await this.mcpResourceScannerService.scanMcpServers(this.mcpResource, this.target);
			if (scannedMcpServers.servers) {
				await Promise.allSettled(Object.entries(scannedMcpServers.servers).map(async ([name, scannedServer]) => {
					const server = await this.scanLocalServer(name, scannedServer);
					local.set(name, server);
				}));
			}
		} catch (error) {
			this.logService.debug('Could not read user MCP servers:', error);
			throw error;
		}
		return local;
	}

	private startWatching(): void {
		this._register(this.fileService.watch(this.mcpResource));
		this._register(this.fileService.onDidFilesChange(e => {
			if (e.affects(this.mcpResource)) {
				this.reloadConfigurationScheduler.schedule();
			}
		}));
	}

	protected async updateLocal(): Promise<void> {
		try {
			const current = await this.populateLocalServers();

			const added: ILocalMcpServer[] = [];
			const updated: ILocalMcpServer[] = [];
			const removed = [...this.local.keys()].filter(name => !current.has(name));

			for (const server of removed) {
				this.local.delete(server);
			}

			for (const [name, server] of current) {
				const previous = this.local.get(name);
				if (previous) {
					if (!equals(previous, server)) {
						updated.push(server);
						this.local.set(name, server);
					}
				} else {
					added.push(server);
					this.local.set(name, server);
				}
			}

			for (const server of removed) {
				this.local.delete(server);
				this._onDidUninstallMcpServer.fire({ name: server, mcpResource: this.mcpResource });
			}

			if (updated.length) {
				this._onDidUpdateMcpServers.fire(updated.map(server => ({ name: server.name, local: server, mcpResource: this.mcpResource })));
			}

			if (added.length) {
				this._onDidInstallMcpServers.fire(added.map(server => ({ name: server.name, local: server, mcpResource: this.mcpResource })));
			}

		} catch (error) {
			this.logService.error('Failed to load installed MCP servers:', error);
		}
	}

	async getInstalled(): Promise<ILocalMcpServer[]> {
		await this.initialize();
		return Array.from(this.local.values());
	}

	protected async scanLocalServer(name: string, config: IMcpServerConfiguration): Promise<ILocalMcpServer> {
		let mcpServerInfo = await this.getLocalServerInfo(name, config);
		if (!mcpServerInfo) {
			mcpServerInfo = { name, version: config.version, galleryUrl: isString(config.gallery) ? config.gallery : undefined };
		}

		return {
			name,
			config,
			mcpResource: this.mcpResource,
			version: mcpServerInfo.version,
			location: mcpServerInfo.location,
			displayName: mcpServerInfo.displayName,
			description: mcpServerInfo.description,
			publisher: mcpServerInfo.publisher,
			publisherDisplayName: mcpServerInfo.publisherDisplayName,
			galleryUrl: mcpServerInfo.galleryUrl,
			galleryId: mcpServerInfo.galleryId,
			repositoryUrl: mcpServerInfo.repositoryUrl,
			readmeUrl: mcpServerInfo.readmeUrl,
			icon: mcpServerInfo.icon,
			codicon: mcpServerInfo.codicon,
			manifest: mcpServerInfo.manifest,
			source: config.gallery ? 'gallery' : 'local'
		};
	}

	async install(server: IInstallableMcpServer, options?: Omit<InstallOptions, 'mcpResource'>): Promise<ILocalMcpServer> {
		this.logService.trace('MCP Management Service: install', server.name);

		this._onInstallMcpServer.fire({ name: server.name, mcpResource: this.mcpResource });
		try {
			await this.mcpResourceScannerService.addMcpServers([server], this.mcpResource, this.target);
			await this.updateLocal();
			const local = this.local.get(server.name);
			if (!local) {
				throw new Error(`Failed to install MCP server: ${server.name}`);
			}
			return local;
		} catch (e) {
			this._onDidInstallMcpServers.fire([{ name: server.name, error: e, mcpResource: this.mcpResource }]);
			throw e;
		}
	}

	async uninstall(server: ILocalMcpServer, options?: Omit<UninstallOptions, 'mcpResource'>): Promise<void> {
		this.logService.trace('MCP Management Service: uninstall', server.name);
		this._onUninstallMcpServer.fire({ name: server.name, mcpResource: this.mcpResource });

		try {
			const currentServers = await this.mcpResourceScannerService.scanMcpServers(this.mcpResource, this.target);
			if (!currentServers.servers) {
				return;
			}
			await this.mcpResourceScannerService.removeMcpServers([server.name], this.mcpResource, this.target);
			if (server.location) {
				await this.fileService.del(URI.revive(server.location), { recursive: true });
			}
			await this.updateLocal();
		} catch (e) {
			this._onDidUninstallMcpServer.fire({ name: server.name, error: e, mcpResource: this.mcpResource });
			throw e;
		}
	}

	protected abstract getLocalServerInfo(name: string, mcpServerConfig: IMcpServerConfiguration): Promise<ILocalMcpServerInfo | undefined>;
	protected abstract installFromUri(uri: URI, options?: Omit<InstallOptions, 'mcpResource'>): Promise<ILocalMcpServer>;
}

export class McpUserResourceManagementService extends AbstractMcpResourceManagementService {

	protected readonly mcpLocation: URI;

	constructor(
		mcpResource: URI,
		@IMcpGalleryService mcpGalleryService: IMcpGalleryService,
		@IFileService fileService: IFileService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@ILogService logService: ILogService,
		@IMcpResourceScannerService mcpResourceScannerService: IMcpResourceScannerService,
		@IEnvironmentService environmentService: IEnvironmentService
	) {
		super(mcpResource, ConfigurationTarget.USER, mcpGalleryService, fileService, uriIdentityService, logService, mcpResourceScannerService);
		this.mcpLocation = uriIdentityService.extUri.joinPath(environmentService.userRoamingDataHome, 'mcp');
	}

	async installFromGallery(server: IGalleryMcpServer, options?: InstallOptions): Promise<ILocalMcpServer> {
		throw new Error('Not supported');
	}

	async updateMetadata(local: ILocalMcpServer, gallery: IGalleryMcpServer): Promise<ILocalMcpServer> {
		await this.updateMetadataFromGallery(gallery);
		await this.updateLocal();
		const updatedLocal = (await this.getInstalled()).find(s => s.name === local.name);
		if (!updatedLocal) {
			throw new Error(`Failed to find MCP server: ${local.name}`);
		}
		return updatedLocal;
	}

	protected async updateMetadataFromGallery(gallery: IGalleryMcpServer): Promise<IGalleryMcpServerConfiguration> {
		const manifest = gallery.configuration;
		const location = this.getLocation(gallery.name, gallery.version);
		const manifestPath = this.uriIdentityService.extUri.joinPath(location, 'manifest.json');
		const local: ILocalMcpServerInfo = {
			galleryUrl: gallery.galleryUrl,
			galleryId: gallery.id,
			name: gallery.name,
			displayName: gallery.displayName,
			description: gallery.description,
			version: gallery.version,
			publisher: gallery.publisher,
			publisherDisplayName: gallery.publisherDisplayName,
			repositoryUrl: gallery.repositoryUrl,
			licenseUrl: gallery.license,
			icon: gallery.icon,
			codicon: gallery.codicon,
			manifest,
		};
		await this.fileService.writeFile(manifestPath, VSBuffer.fromString(JSON.stringify(local)));

		if (gallery.readmeUrl || gallery.readme) {
			const readme = gallery.readme ? gallery.readme : await this.mcpGalleryService.getReadme(gallery, CancellationToken.None);
			await this.fileService.writeFile(this.uriIdentityService.extUri.joinPath(location, 'README.md'), VSBuffer.fromString(readme));
		}

		return manifest;
	}

	protected async getLocalServerInfo(name: string, mcpServerConfig: IMcpServerConfiguration): Promise<ILocalMcpServerInfo | undefined> {
		let storedMcpServerInfo: ILocalMcpServerInfo | undefined;
		let location: URI | undefined;
		let readmeUrl: URI | undefined;
		if (mcpServerConfig.gallery) {
			location = this.getLocation(name, mcpServerConfig.version);
			const manifestLocation = this.uriIdentityService.extUri.joinPath(location, 'manifest.json');
			try {
				const content = await this.fileService.readFile(manifestLocation);
				storedMcpServerInfo = JSON.parse(content.value.toString()) as ILocalMcpServerInfo;

				// migrate
				if (storedMcpServerInfo.galleryUrl?.includes('/v0/')) {
					storedMcpServerInfo.galleryUrl = storedMcpServerInfo.galleryUrl.substring(0, storedMcpServerInfo.galleryUrl.indexOf('/v0/'));
					await this.fileService.writeFile(manifestLocation, VSBuffer.fromString(JSON.stringify(storedMcpServerInfo)));
				}

				storedMcpServerInfo.location = location;
				readmeUrl = this.uriIdentityService.extUri.joinPath(location, 'README.md');
				if (!await this.fileService.exists(readmeUrl)) {
					readmeUrl = undefined;
				}
				storedMcpServerInfo.readmeUrl = readmeUrl;
			} catch (e) {
				this.logService.error('MCP Management Service: failed to read manifest', location.toString(), e);
			}
		}
		return storedMcpServerInfo;
	}

	protected getLocation(name: string, version?: string): URI {
		name = name.replace('/', '.');
		return this.uriIdentityService.extUri.joinPath(this.mcpLocation, version ? `${name}-${version}` : name);
	}

	protected override installFromUri(uri: URI, options?: Omit<InstallOptions, 'mcpResource'>): Promise<ILocalMcpServer> {
		throw new Error('Method not supported.');
	}

	override canInstall(): true | IMarkdownString {
		throw new Error('Not supported');
	}

}

export abstract class AbstractMcpManagementService extends AbstractCommonMcpManagementService implements IMcpManagementService {

	constructor(
		@IAllowedMcpServersService protected readonly allowedMcpServersService: IAllowedMcpServersService,
		@ILogService logService: ILogService,
	) {
		super(logService);
	}

	canInstall(server: IGalleryMcpServer | IInstallableMcpServer): true | IMarkdownString {
		const allowedToInstall = this.allowedMcpServersService.isAllowed(server);
		if (allowedToInstall !== true) {
			return new MarkdownString(localize('not allowed to install', "This mcp server cannot be installed because {0}", allowedToInstall.value));
		}
		return true;
	}
}

export class McpManagementService extends AbstractMcpManagementService implements IMcpManagementService {

	private readonly _onInstallMcpServer = this._register(new Emitter<InstallMcpServerEvent>());
	readonly onInstallMcpServer = this._onInstallMcpServer.event;

	private readonly _onDidInstallMcpServers = this._register(new Emitter<readonly InstallMcpServerResult[]>());
	readonly onDidInstallMcpServers = this._onDidInstallMcpServers.event;

	private readonly _onDidUpdateMcpServers = this._register(new Emitter<readonly InstallMcpServerResult[]>());
	readonly onDidUpdateMcpServers = this._onDidUpdateMcpServers.event;

	private readonly _onUninstallMcpServer = this._register(new Emitter<UninstallMcpServerEvent>());
	readonly onUninstallMcpServer = this._onUninstallMcpServer.event;

	private readonly _onDidUninstallMcpServer = this._register(new Emitter<DidUninstallMcpServerEvent>());
	readonly onDidUninstallMcpServer = this._onDidUninstallMcpServer.event;

	private readonly mcpResourceManagementServices = new ResourceMap<{ service: McpUserResourceManagementService } & IDisposable>();

	constructor(
		@IAllowedMcpServersService allowedMcpServersService: IAllowedMcpServersService,
		@ILogService logService: ILogService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IInstantiationService protected readonly instantiationService: IInstantiationService,
	) {
		super(allowedMcpServersService, logService);
	}

	private getMcpResourceManagementService(mcpResource: URI): McpUserResourceManagementService {
		let mcpResourceManagementService = this.mcpResourceManagementServices.get(mcpResource);
		if (!mcpResourceManagementService) {
			const disposables = new DisposableStore();
			const service = disposables.add(this.createMcpResourceManagementService(mcpResource));
			disposables.add(service.onInstallMcpServer(e => this._onInstallMcpServer.fire(e)));
			disposables.add(service.onDidInstallMcpServers(e => this._onDidInstallMcpServers.fire(e)));
			disposables.add(service.onDidUpdateMcpServers(e => this._onDidUpdateMcpServers.fire(e)));
			disposables.add(service.onUninstallMcpServer(e => this._onUninstallMcpServer.fire(e)));
			disposables.add(service.onDidUninstallMcpServer(e => this._onDidUninstallMcpServer.fire(e)));
			this.mcpResourceManagementServices.set(mcpResource, mcpResourceManagementService = { service, dispose: () => disposables.dispose() });
		}
		return mcpResourceManagementService.service;
	}

	async getInstalled(mcpResource?: URI): Promise<ILocalMcpServer[]> {
		const mcpResourceUri = mcpResource || this.userDataProfilesService.defaultProfile.mcpResource;
		return this.getMcpResourceManagementService(mcpResourceUri).getInstalled();
	}

	async install(server: IInstallableMcpServer, options?: InstallOptions): Promise<ILocalMcpServer> {
		const mcpResourceUri = options?.mcpResource || this.userDataProfilesService.defaultProfile.mcpResource;
		return this.getMcpResourceManagementService(mcpResourceUri).install(server, options);
	}

	async uninstall(server: ILocalMcpServer, options?: UninstallOptions): Promise<void> {
		const mcpResourceUri = options?.mcpResource || this.userDataProfilesService.defaultProfile.mcpResource;
		return this.getMcpResourceManagementService(mcpResourceUri).uninstall(server, options);
	}

	async installFromGallery(server: IGalleryMcpServer, options?: InstallOptions): Promise<ILocalMcpServer> {
		const mcpResourceUri = options?.mcpResource || this.userDataProfilesService.defaultProfile.mcpResource;
		return this.getMcpResourceManagementService(mcpResourceUri).installFromGallery(server, options);
	}

	async updateMetadata(local: ILocalMcpServer, gallery: IGalleryMcpServer, mcpResource?: URI): Promise<ILocalMcpServer> {
		return this.getMcpResourceManagementService(mcpResource || this.userDataProfilesService.defaultProfile.mcpResource).updateMetadata(local, gallery);
	}

	override dispose(): void {
		this.mcpResourceManagementServices.forEach(service => service.dispose());
		this.mcpResourceManagementServices.clear();
		super.dispose();
	}

	protected createMcpResourceManagementService(mcpResource: URI): McpUserResourceManagementService {
		return this.instantiationService.createInstance(McpUserResourceManagementService, mcpResource);
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/mcp/common/mcpPlatformTypes.ts]---
Location: vscode-main/src/vs/platform/mcp/common/mcpPlatformTypes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStringDictionary } from '../../../base/common/collections.js';

export interface IMcpDevModeConfig {
	/** Pattern or list of glob patterns to watch relative to the workspace folder. */
	watch?: string | string[];
	/** Whether to debug the MCP server when it's started. */
	debug?: { type: 'node' } | { type: 'debugpy'; debugpyPath?: string };
}

export const enum McpServerVariableType {
	PROMPT = 'promptString',
	PICK = 'pickString',
}

export interface IMcpServerVariable {
	readonly id: string;
	readonly type: McpServerVariableType;
	readonly description: string;
	readonly password: boolean;
	readonly default?: string;
	readonly options?: readonly string[];
	readonly serverName?: string;
}

export const enum McpServerType {
	LOCAL = 'stdio',
	REMOTE = 'http',
}

export interface ICommonMcpServerConfiguration {
	readonly type: McpServerType;
	readonly version?: string;
	readonly gallery?: boolean | string;
}

export interface IMcpStdioServerConfiguration extends ICommonMcpServerConfiguration {
	readonly type: McpServerType.LOCAL;
	readonly command: string;
	readonly args?: readonly string[];
	readonly env?: Record<string, string | number | null>;
	readonly envFile?: string;
	readonly cwd?: string;
	readonly dev?: IMcpDevModeConfig;
}

export interface IMcpRemoteServerConfiguration extends ICommonMcpServerConfiguration {
	readonly type: McpServerType.REMOTE;
	readonly url: string;
	readonly headers?: Record<string, string>;
	readonly dev?: IMcpDevModeConfig;
}

export type IMcpServerConfiguration = IMcpStdioServerConfiguration | IMcpRemoteServerConfiguration;

export interface IMcpServersConfiguration {
	servers?: IStringDictionary<IMcpServerConfiguration>;
	inputs?: IMcpServerVariable[];
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/mcp/common/mcpResourceScannerService.ts]---
Location: vscode-main/src/vs/platform/mcp/common/mcpResourceScannerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { assertNever } from '../../../base/common/assert.js';
import { Queue } from '../../../base/common/async.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { IStringDictionary } from '../../../base/common/collections.js';
import { parse, ParseError } from '../../../base/common/json.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../base/common/map.js';
import { Mutable } from '../../../base/common/types.js';
import { URI } from '../../../base/common/uri.js';
import { ConfigurationTarget, ConfigurationTargetToString } from '../../configuration/common/configuration.js';
import { FileOperationResult, IFileService, toFileOperationResult } from '../../files/common/files.js';
import { InstantiationType, registerSingleton } from '../../instantiation/common/extensions.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { IInstallableMcpServer } from './mcpManagement.js';
import { ICommonMcpServerConfiguration, IMcpServerConfiguration, IMcpServerVariable, IMcpStdioServerConfiguration, McpServerType } from './mcpPlatformTypes.js';

interface IScannedMcpServers {
	servers?: IStringDictionary<Mutable<IMcpServerConfiguration>>;
	inputs?: IMcpServerVariable[];
}

interface IOldScannedMcpServer {
	id: string;
	name: string;
	version?: string;
	gallery?: boolean;
	config: Mutable<IMcpServerConfiguration>;
}

interface IScannedWorkspaceMcpServers {
	settings?: {
		mcp?: IScannedMcpServers;
	};
}

export type McpResourceTarget = ConfigurationTarget.USER | ConfigurationTarget.WORKSPACE | ConfigurationTarget.WORKSPACE_FOLDER;

export const IMcpResourceScannerService = createDecorator<IMcpResourceScannerService>('IMcpResourceScannerService');
export interface IMcpResourceScannerService {
	readonly _serviceBrand: undefined;
	scanMcpServers(mcpResource: URI, target?: McpResourceTarget): Promise<IScannedMcpServers>;
	addMcpServers(servers: IInstallableMcpServer[], mcpResource: URI, target?: McpResourceTarget): Promise<void>;
	removeMcpServers(serverNames: string[], mcpResource: URI, target?: McpResourceTarget): Promise<void>;
}

export class McpResourceScannerService extends Disposable implements IMcpResourceScannerService {
	readonly _serviceBrand: undefined;

	private readonly resourcesAccessQueueMap = new ResourceMap<Queue<IScannedMcpServers>>();

	constructor(
		@IFileService private readonly fileService: IFileService,
		@IUriIdentityService protected readonly uriIdentityService: IUriIdentityService,
	) {
		super();
	}

	async scanMcpServers(mcpResource: URI, target?: McpResourceTarget): Promise<IScannedMcpServers> {
		return this.withProfileMcpServers(mcpResource, target);
	}

	async addMcpServers(servers: IInstallableMcpServer[], mcpResource: URI, target?: McpResourceTarget): Promise<void> {
		await this.withProfileMcpServers(mcpResource, target, scannedMcpServers => {
			let updatedInputs = scannedMcpServers.inputs ?? [];
			const existingServers = scannedMcpServers.servers ?? {};
			for (const { name, config, inputs } of servers) {
				existingServers[name] = config;
				if (inputs) {
					const existingInputIds = new Set(updatedInputs.map(input => input.id));
					const newInputs = inputs.filter(input => !existingInputIds.has(input.id));
					updatedInputs = [...updatedInputs, ...newInputs];
				}
			}
			return { servers: existingServers, inputs: updatedInputs };
		});
	}

	async removeMcpServers(serverNames: string[], mcpResource: URI, target?: McpResourceTarget): Promise<void> {
		await this.withProfileMcpServers(mcpResource, target, scannedMcpServers => {
			for (const serverName of serverNames) {
				if (scannedMcpServers.servers?.[serverName]) {
					delete scannedMcpServers.servers[serverName];
				}
			}
			return scannedMcpServers;
		});
	}

	private async withProfileMcpServers(mcpResource: URI, target?: McpResourceTarget, updateFn?: (data: IScannedMcpServers) => IScannedMcpServers): Promise<IScannedMcpServers> {
		return this.getResourceAccessQueue(mcpResource)
			.queue(async (): Promise<IScannedMcpServers> => {
				target = target ?? ConfigurationTarget.USER;
				let scannedMcpServers: IScannedMcpServers = {};
				try {
					const content = await this.fileService.readFile(mcpResource);
					const errors: ParseError[] = [];
					const result = parse(content.value.toString(), errors, { allowTrailingComma: true, allowEmptyContent: true }) || {};
					if (errors.length > 0) {
						throw new Error('Failed to parse scanned MCP servers: ' + errors.join(', '));
					}

					if (target === ConfigurationTarget.USER) {
						scannedMcpServers = this.fromUserMcpServers(result);
					} else if (target === ConfigurationTarget.WORKSPACE_FOLDER) {
						scannedMcpServers = this.fromWorkspaceFolderMcpServers(result);
					} else if (target === ConfigurationTarget.WORKSPACE) {
						const workspaceScannedMcpServers: IScannedWorkspaceMcpServers = result;
						if (workspaceScannedMcpServers.settings?.mcp) {
							scannedMcpServers = this.fromWorkspaceFolderMcpServers(workspaceScannedMcpServers.settings?.mcp);
						}
					}
				} catch (error) {
					if (toFileOperationResult(error) !== FileOperationResult.FILE_NOT_FOUND) {
						throw error;
					}
				}
				if (updateFn) {
					scannedMcpServers = updateFn(scannedMcpServers ?? {});

					if (target === ConfigurationTarget.USER) {
						await this.writeScannedMcpServers(mcpResource, scannedMcpServers);
					} else if (target === ConfigurationTarget.WORKSPACE_FOLDER) {
						await this.writeScannedMcpServersToWorkspaceFolder(mcpResource, scannedMcpServers);
					} else if (target === ConfigurationTarget.WORKSPACE) {
						await this.writeScannedMcpServersToWorkspace(mcpResource, scannedMcpServers);
					} else {
						assertNever(target, `Invalid Target: ${ConfigurationTargetToString(target)}`);
					}
				}
				return scannedMcpServers;
			});
	}

	private async writeScannedMcpServers(mcpResource: URI, scannedMcpServers: IScannedMcpServers): Promise<void> {
		if ((scannedMcpServers.servers && Object.keys(scannedMcpServers.servers).length > 0) || (scannedMcpServers.inputs && scannedMcpServers.inputs.length > 0)) {
			await this.fileService.writeFile(mcpResource, VSBuffer.fromString(JSON.stringify(scannedMcpServers, null, '\t')));
		} else {
			await this.fileService.del(mcpResource);
		}
	}

	private async writeScannedMcpServersToWorkspaceFolder(mcpResource: URI, scannedMcpServers: IScannedMcpServers): Promise<void> {
		await this.fileService.writeFile(mcpResource, VSBuffer.fromString(JSON.stringify(scannedMcpServers, null, '\t')));
	}

	private async writeScannedMcpServersToWorkspace(mcpResource: URI, scannedMcpServers: IScannedMcpServers): Promise<void> {
		let scannedWorkspaceMcpServers: IScannedWorkspaceMcpServers | undefined;
		try {
			const content = await this.fileService.readFile(mcpResource);
			const errors: ParseError[] = [];
			scannedWorkspaceMcpServers = parse(content.value.toString(), errors, { allowTrailingComma: true, allowEmptyContent: true }) as IScannedWorkspaceMcpServers;
			if (errors.length > 0) {
				throw new Error('Failed to parse scanned MCP servers: ' + errors.join(', '));
			}
		} catch (error) {
			if (toFileOperationResult(error) !== FileOperationResult.FILE_NOT_FOUND) {
				throw error;
			}
			scannedWorkspaceMcpServers = { settings: {} };
		}
		if (!scannedWorkspaceMcpServers.settings) {
			scannedWorkspaceMcpServers.settings = {};
		}
		scannedWorkspaceMcpServers.settings.mcp = scannedMcpServers;
		await this.fileService.writeFile(mcpResource, VSBuffer.fromString(JSON.stringify(scannedWorkspaceMcpServers, null, '\t')));
	}

	private fromUserMcpServers(scannedMcpServers: IScannedMcpServers): IScannedMcpServers {
		const userMcpServers: IScannedMcpServers = {
			inputs: scannedMcpServers.inputs
		};
		const servers = Object.entries(scannedMcpServers.servers ?? {});
		if (servers.length > 0) {
			userMcpServers.servers = {};
			for (const [serverName, server] of servers) {
				userMcpServers.servers[serverName] = this.sanitizeServer(server);
			}
		}
		return userMcpServers;
	}

	private fromWorkspaceFolderMcpServers(scannedWorkspaceFolderMcpServers: IScannedMcpServers): IScannedMcpServers {
		const scannedMcpServers: IScannedMcpServers = {
			inputs: scannedWorkspaceFolderMcpServers.inputs
		};
		const servers = Object.entries(scannedWorkspaceFolderMcpServers.servers ?? {});
		if (servers.length > 0) {
			scannedMcpServers.servers = {};
			for (const [serverName, config] of servers) {
				scannedMcpServers.servers[serverName] = this.sanitizeServer(config);
			}
		}
		return scannedMcpServers;
	}

	private sanitizeServer(serverOrConfig: IOldScannedMcpServer | Mutable<IMcpServerConfiguration>): IMcpServerConfiguration {
		let server: IMcpServerConfiguration;
		if ((<IOldScannedMcpServer>serverOrConfig).config) {
			const oldScannedMcpServer = <IOldScannedMcpServer>serverOrConfig;
			server = {
				...oldScannedMcpServer.config,
				version: oldScannedMcpServer.version,
				gallery: oldScannedMcpServer.gallery
			};
		} else {
			server = serverOrConfig as IMcpServerConfiguration;
		}

		if (server.type === undefined || (server.type !== McpServerType.REMOTE && server.type !== McpServerType.LOCAL)) {
			(<Mutable<ICommonMcpServerConfiguration>>server).type = (<IMcpStdioServerConfiguration>server).command ? McpServerType.LOCAL : McpServerType.REMOTE;
		}

		return server;
	}

	private getResourceAccessQueue(file: URI): Queue<IScannedMcpServers> {
		let resourceQueue = this.resourcesAccessQueueMap.get(file);
		if (!resourceQueue) {
			resourceQueue = new Queue<IScannedMcpServers>();
			this.resourcesAccessQueueMap.set(file, resourceQueue);
		}
		return resourceQueue;
	}
}

registerSingleton(IMcpResourceScannerService, McpResourceScannerService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/mcp/common/nativeMcpDiscoveryHelper.ts]---
Location: vscode-main/src/vs/platform/mcp/common/nativeMcpDiscoveryHelper.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Platform } from '../../../base/common/platform.js';
import { URI } from '../../../base/common/uri.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export const INativeMcpDiscoveryHelperService = createDecorator<INativeMcpDiscoveryHelperService>('INativeMcpDiscoveryHelperService');

export const NativeMcpDiscoveryHelperChannelName = 'NativeMcpDiscoveryHelper';

export interface INativeMcpDiscoveryData {
	// platform and homedir are duplicated by the remote/native environment, but here for convenience
	platform: Platform;
	homedir: URI;
	winAppData?: URI;
	xdgHome?: URI;
}

export interface INativeMcpDiscoveryHelperService {
	readonly _serviceBrand: undefined;

	load(): Promise<INativeMcpDiscoveryData>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/mcp/node/mcpManagementService.ts]---
Location: vscode-main/src/vs/platform/mcp/node/mcpManagementService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../base/common/uri.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { IFileService } from '../../files/common/files.js';
import { ILogService } from '../../log/common/log.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { IGalleryMcpServer, IMcpGalleryService, IMcpManagementService, InstallOptions, ILocalMcpServer, RegistryType, IInstallableMcpServer } from '../common/mcpManagement.js';
import { McpUserResourceManagementService as CommonMcpUserResourceManagementService, McpManagementService as CommonMcpManagementService } from '../common/mcpManagementService.js';
import { IMcpResourceScannerService } from '../common/mcpResourceScannerService.js';

export class McpUserResourceManagementService extends CommonMcpUserResourceManagementService {
	constructor(
		mcpResource: URI,
		@IMcpGalleryService mcpGalleryService: IMcpGalleryService,
		@IFileService fileService: IFileService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@ILogService logService: ILogService,
		@IMcpResourceScannerService mcpResourceScannerService: IMcpResourceScannerService,
		@IEnvironmentService environmentService: IEnvironmentService,
	) {
		super(mcpResource, mcpGalleryService, fileService, uriIdentityService, logService, mcpResourceScannerService, environmentService);
	}

	override async installFromGallery(server: IGalleryMcpServer, options?: InstallOptions): Promise<ILocalMcpServer> {
		this.logService.trace('MCP Management Service: installGallery', server.name, server.galleryUrl);

		this._onInstallMcpServer.fire({ name: server.name, mcpResource: this.mcpResource });

		try {
			const manifest = await this.updateMetadataFromGallery(server);
			const packageType = options?.packageType ?? manifest.packages?.[0]?.registryType ?? RegistryType.REMOTE;

			const { mcpServerConfiguration, notices } = this.getMcpServerConfigurationFromManifest(manifest, packageType);

			if (notices.length > 0) {
				this.logService.warn(`MCP Management Service: Warnings while installing ${server.name}`, notices);
			}

			const installable: IInstallableMcpServer = {
				name: server.name,
				config: {
					...mcpServerConfiguration.config,
					gallery: server.galleryUrl ?? true,
					version: server.version
				},
				inputs: mcpServerConfiguration.inputs
			};

			await this.mcpResourceScannerService.addMcpServers([installable], this.mcpResource, this.target);

			await this.updateLocal();
			const local = (await this.getInstalled()).find(s => s.name === server.name);
			if (!local) {
				throw new Error(`Failed to install MCP server: ${server.name}`);
			}
			return local;
		} catch (e) {
			this._onDidInstallMcpServers.fire([{ name: server.name, source: server, error: e, mcpResource: this.mcpResource }]);
			throw e;
		}
	}

}

export class McpManagementService extends CommonMcpManagementService implements IMcpManagementService {
	protected override createMcpResourceManagementService(mcpResource: URI): McpUserResourceManagementService {
		return this.instantiationService.createInstance(McpUserResourceManagementService, mcpResource);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/mcp/node/nativeMcpDiscoveryHelperChannel.ts]---
Location: vscode-main/src/vs/platform/mcp/node/nativeMcpDiscoveryHelperChannel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { IURITransformer, transformOutgoingURIs } from '../../../base/common/uriIpc.js';
import { IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import { RemoteAgentConnectionContext } from '../../remote/common/remoteAgentEnvironment.js';
import { INativeMcpDiscoveryHelperService } from '../common/nativeMcpDiscoveryHelper.js';

export class NativeMcpDiscoveryHelperChannel implements IServerChannel<RemoteAgentConnectionContext> {

	constructor(
		private readonly getUriTransformer: undefined | ((requestContext: RemoteAgentConnectionContext) => IURITransformer),
		@INativeMcpDiscoveryHelperService private nativeMcpDiscoveryHelperService: INativeMcpDiscoveryHelperService
	) { }

	listen<T>(context: RemoteAgentConnectionContext, event: string): Event<T> {
		throw new Error('Invalid listen');
	}

	async call<T>(context: RemoteAgentConnectionContext, command: string, args?: unknown): Promise<T> {
		const uriTransformer = this.getUriTransformer?.(context);
		switch (command) {
			case 'load': {
				const result = await this.nativeMcpDiscoveryHelperService.load();
				return (uriTransformer ? transformOutgoingURIs(result, uriTransformer) : result) as T;
			}
		}
		throw new Error('Invalid call');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/mcp/node/nativeMcpDiscoveryHelperService.ts]---
Location: vscode-main/src/vs/platform/mcp/node/nativeMcpDiscoveryHelperService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { homedir } from 'os';
import { platform } from '../../../base/common/platform.js';
import { URI } from '../../../base/common/uri.js';
import { INativeMcpDiscoveryData, INativeMcpDiscoveryHelperService } from '../common/nativeMcpDiscoveryHelper.js';

export class NativeMcpDiscoveryHelperService implements INativeMcpDiscoveryHelperService {
	declare readonly _serviceBrand: undefined;

	constructor() { }

	load(): Promise<INativeMcpDiscoveryData> {
		return Promise.resolve({
			platform,
			homedir: URI.file(homedir()),
			winAppData: this.uriFromEnvVariable('APPDATA'),
			xdgHome: this.uriFromEnvVariable('XDG_CONFIG_HOME'),
		});
	}

	private uriFromEnvVariable(varName: string) {
		const envVar = process.env[varName];
		if (!envVar) {
			return undefined;
		}
		return URI.file(envVar);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/mcp/test/common/mcpManagementService.test.ts]---
Location: vscode-main/src/vs/platform/mcp/test/common/mcpManagementService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { AbstractCommonMcpManagementService } from '../../common/mcpManagementService.js';
import { IGalleryMcpServer, IGalleryMcpServerConfiguration, IInstallableMcpServer, ILocalMcpServer, InstallOptions, RegistryType, TransportType, UninstallOptions } from '../../common/mcpManagement.js';
import { McpServerType, McpServerVariableType, IMcpServerVariable } from '../../common/mcpPlatformTypes.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { Event } from '../../../../base/common/event.js';
import { URI } from '../../../../base/common/uri.js';
import { NullLogService } from '../../../log/common/log.js';

class TestMcpManagementService extends AbstractCommonMcpManagementService {

	override onInstallMcpServer = Event.None;
	override onDidInstallMcpServers = Event.None;
	override onDidUpdateMcpServers = Event.None;
	override onUninstallMcpServer = Event.None;
	override onDidUninstallMcpServer = Event.None;

	override getInstalled(mcpResource?: URI): Promise<ILocalMcpServer[]> {
		throw new Error('Method not implemented.');
	}
	override install(server: IInstallableMcpServer, options?: InstallOptions): Promise<ILocalMcpServer> {
		throw new Error('Method not implemented.');
	}
	override installFromGallery(server: IGalleryMcpServer, options?: InstallOptions): Promise<ILocalMcpServer> {
		throw new Error('Method not implemented.');
	}
	override updateMetadata(local: ILocalMcpServer, server: IGalleryMcpServer, profileLocation?: URI): Promise<ILocalMcpServer> {
		throw new Error('Method not implemented.');
	}
	override uninstall(server: ILocalMcpServer, options?: UninstallOptions): Promise<void> {
		throw new Error('Method not implemented.');
	}

	override canInstall(server: IGalleryMcpServer | IInstallableMcpServer): true | IMarkdownString {
		throw new Error('Not supported');
	}
}

suite('McpManagementService - getMcpServerConfigurationFromManifest', () => {
	let service: TestMcpManagementService;

	setup(() => {
		service = new TestMcpManagementService(new NullLogService());
	});

	teardown(() => {
		service.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	suite('NPM Package Tests', () => {
		test('basic NPM package configuration', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				packages: [{
					registryType: RegistryType.NODE,
					registryBaseUrl: 'https://registry.npmjs.org',
					identifier: '@modelcontextprotocol/server-brave-search',
					transport: { type: TransportType.STDIO },
					version: '1.0.2',
					environmentVariables: [{
						name: 'BRAVE_API_KEY',
						value: 'test-key'
					}]
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.NODE);

			assert.strictEqual(result.mcpServerConfiguration.config.type, McpServerType.LOCAL);
			if (result.mcpServerConfiguration.config.type === McpServerType.LOCAL) {
				assert.strictEqual(result.mcpServerConfiguration.config.command, 'npx');
				assert.deepStrictEqual(result.mcpServerConfiguration.config.args, ['@modelcontextprotocol/server-brave-search@1.0.2']);
				assert.deepStrictEqual(result.mcpServerConfiguration.config.env, { 'BRAVE_API_KEY': 'test-key' });
			}
			assert.strictEqual(result.mcpServerConfiguration.inputs, undefined);
		});

		test('NPM package without version', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				packages: [{
					registryType: RegistryType.NODE,
					registryBaseUrl: 'https://registry.npmjs.org',
					identifier: '@modelcontextprotocol/everything',
					version: '',
					transport: { type: TransportType.STDIO }
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.NODE);

			assert.strictEqual(result.mcpServerConfiguration.config.type, McpServerType.LOCAL);
			if (result.mcpServerConfiguration.config.type === McpServerType.LOCAL) {
				assert.strictEqual(result.mcpServerConfiguration.config.command, 'npx');
				assert.deepStrictEqual(result.mcpServerConfiguration.config.args, ['@modelcontextprotocol/everything']);
			}
		});

		test('NPM package with environment variables containing variables', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				packages: [{
					registryType: RegistryType.NODE,
					transport: { type: TransportType.STDIO },
					identifier: 'test-server',
					version: '1.0.0',
					environmentVariables: [{
						name: 'API_KEY',
						value: 'key-{api_token}',
						variables: {
							api_token: {
								description: 'Your API token',
								isSecret: true,
								isRequired: true
							}
						}
					}]
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.NODE);

			assert.strictEqual(result.mcpServerConfiguration.config.type, McpServerType.LOCAL);
			if (result.mcpServerConfiguration.config.type === McpServerType.LOCAL) {
				assert.deepStrictEqual(result.mcpServerConfiguration.config.env, { 'API_KEY': 'key-${input:api_token}' });
			}
			assert.strictEqual(result.mcpServerConfiguration.inputs?.length, 1);
			assert.strictEqual(result.mcpServerConfiguration.inputs?.[0].id, 'api_token');
			assert.strictEqual(result.mcpServerConfiguration.inputs?.[0].type, McpServerVariableType.PROMPT);
			assert.strictEqual(result.mcpServerConfiguration.inputs?.[0].description, 'Your API token');
			assert.strictEqual(result.mcpServerConfiguration.inputs?.[0].password, true);
		});

		test('environment variable with empty value should create input variable (GitHub issue #266106)', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				packages: [{
					registryType: RegistryType.NODE,
					transport: { type: TransportType.STDIO },
					identifier: '@modelcontextprotocol/server-brave-search',
					version: '1.0.2',
					environmentVariables: [{
						name: 'BRAVE_API_KEY',
						value: '', // Empty value should create input variable
						description: 'Brave Search API Key',
						isRequired: true,
						isSecret: true
					}]
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.NODE);

			// BUG: Currently this creates env with empty string instead of input variable
			// Should create an input variable since no meaningful value is provided
			assert.strictEqual(result.mcpServerConfiguration.inputs?.length, 1);
			assert.strictEqual(result.mcpServerConfiguration.inputs?.[0].id, 'BRAVE_API_KEY');
			assert.strictEqual(result.mcpServerConfiguration.inputs?.[0].description, 'Brave Search API Key');
			assert.strictEqual(result.mcpServerConfiguration.inputs?.[0].password, true);
			assert.strictEqual(result.mcpServerConfiguration.inputs?.[0].type, McpServerVariableType.PROMPT);

			// Environment should use input variable interpolation
			if (result.mcpServerConfiguration.config.type === McpServerType.LOCAL) {
				assert.deepStrictEqual(result.mcpServerConfiguration.config.env, { 'BRAVE_API_KEY': '${input:BRAVE_API_KEY}' });
			}
		});

		test('environment variable with choices but empty value should create pick input (GitHub issue #266106)', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				packages: [{
					registryType: RegistryType.NODE,
					transport: { type: TransportType.STDIO },
					identifier: 'test-server',
					version: '1.0.0',
					environmentVariables: [{
						name: 'SSL_MODE',
						value: '', // Empty value should create input variable
						description: 'SSL connection mode',
						default: 'prefer',
						choices: ['disable', 'prefer', 'require']
					}]
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.NODE);

			// BUG: Currently this creates env with empty string instead of input variable
			// Should create a pick input variable since choices are provided
			assert.strictEqual(result.mcpServerConfiguration.inputs?.length, 1);
			assert.strictEqual(result.mcpServerConfiguration.inputs?.[0].id, 'SSL_MODE');
			assert.strictEqual(result.mcpServerConfiguration.inputs?.[0].description, 'SSL connection mode');
			assert.strictEqual(result.mcpServerConfiguration.inputs?.[0].default, 'prefer');
			assert.strictEqual(result.mcpServerConfiguration.inputs?.[0].type, McpServerVariableType.PICK);
			assert.deepStrictEqual(result.mcpServerConfiguration.inputs?.[0].options, ['disable', 'prefer', 'require']);

			// Environment should use input variable interpolation
			if (result.mcpServerConfiguration.config.type === McpServerType.LOCAL) {
				assert.deepStrictEqual(result.mcpServerConfiguration.config.env, { 'SSL_MODE': '${input:SSL_MODE}' });
			}
		});

		test('NPM package with package arguments', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				packages: [{
					registryType: RegistryType.NODE,
					transport: { type: TransportType.STDIO },
					identifier: 'snyk',
					version: '1.1298.0',
					packageArguments: [
						{ type: 'positional', value: 'mcp', valueHint: 'command', isRepeated: false },
						{
							type: 'named',
							name: '-t',
							value: 'stdio',
							isRepeated: false
						}
					]
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.NODE);

			assert.strictEqual(result.mcpServerConfiguration.config.type, McpServerType.LOCAL);
			if (result.mcpServerConfiguration.config.type === McpServerType.LOCAL) {
				assert.deepStrictEqual(result.mcpServerConfiguration.config.args, ['snyk@1.1298.0', 'mcp', '-t', 'stdio']);
			}
		});
	});

	suite('Python Package Tests', () => {
		test('basic Python package configuration', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				packages: [{
					registryType: RegistryType.PYTHON,
					transport: { type: TransportType.STDIO },
					registryBaseUrl: 'https://pypi.org',
					identifier: 'weather-mcp-server',
					version: '0.5.0',
					environmentVariables: [{
						name: 'WEATHER_API_KEY',
						value: 'test-key'
					}, {
						name: 'WEATHER_UNITS',
						value: 'celsius'
					}]
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.PYTHON);

			assert.strictEqual(result.mcpServerConfiguration.config.type, McpServerType.LOCAL);
			if (result.mcpServerConfiguration.config.type === McpServerType.LOCAL) {
				assert.strictEqual(result.mcpServerConfiguration.config.command, 'uvx');
				assert.deepStrictEqual(result.mcpServerConfiguration.config.args, ['weather-mcp-server==0.5.0']);
				assert.deepStrictEqual(result.mcpServerConfiguration.config.env, {
					'WEATHER_API_KEY': 'test-key',
					'WEATHER_UNITS': 'celsius'
				});
			}
		});

		test('Python package without version', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				packages: [{
					registryType: RegistryType.PYTHON,
					transport: { type: TransportType.STDIO },
					identifier: 'weather-mcp-server',
					version: ''
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.PYTHON);

			if (result.mcpServerConfiguration.config.type === McpServerType.LOCAL) {
				assert.deepStrictEqual(result.mcpServerConfiguration.config.args, ['weather-mcp-server']);
			}
		});
	});

	suite('Docker Package Tests', () => {
		test('basic Docker package configuration', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				packages: [{
					registryType: RegistryType.DOCKER,
					transport: { type: TransportType.STDIO },
					registryBaseUrl: 'https://docker.io',
					identifier: 'mcp/filesystem',
					version: '1.0.2',
					runtimeArguments: [{
						type: 'named',
						name: '--mount',
						value: 'type=bind,src=/host/path,dst=/container/path',
						isRepeated: false
					}],
					environmentVariables: [{
						name: 'LOG_LEVEL',
						value: 'info'
					}],
					packageArguments: [{
						type: 'positional',
						value: '/project',
						valueHint: 'directory',
						isRepeated: false
					}]
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.DOCKER);

			assert.strictEqual(result.mcpServerConfiguration.config.type, McpServerType.LOCAL);
			if (result.mcpServerConfiguration.config.type === McpServerType.LOCAL) {
				assert.strictEqual(result.mcpServerConfiguration.config.command, 'docker');
				assert.deepStrictEqual(result.mcpServerConfiguration.config.args, [
					'run', '-i', '--rm',
					'--mount', 'type=bind,src=/host/path,dst=/container/path',
					'-e', 'LOG_LEVEL',
					'mcp/filesystem:1.0.2',
					'/project'
				]);
				assert.deepStrictEqual(result.mcpServerConfiguration.config.env, { 'LOG_LEVEL': 'info' });
			}
		});

		test('Docker package with variables in runtime arguments', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				packages: [{
					registryType: RegistryType.DOCKER,
					transport: { type: TransportType.STDIO },
					identifier: 'example/database-manager-mcp',
					version: '3.1.0',
					runtimeArguments: [{
						type: 'named',
						name: '-e',
						value: 'DB_TYPE={db_type}',
						isRepeated: false,
						variables: {
							db_type: {
								description: 'Type of database',
								choices: ['postgres', 'mysql', 'mongodb', 'redis'],
								isRequired: true
							}
						}
					}]
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.DOCKER);

			assert.strictEqual(result.mcpServerConfiguration.config.type, McpServerType.LOCAL);
			if (result.mcpServerConfiguration.config.type === McpServerType.LOCAL) {
				assert.deepStrictEqual(result.mcpServerConfiguration.config.args, [
					'run', '-i', '--rm',
					'-e', 'DB_TYPE=${input:db_type}',
					'example/database-manager-mcp:3.1.0'
				]);
			}
			assert.strictEqual(result.mcpServerConfiguration.inputs?.length, 1);
			assert.strictEqual(result.mcpServerConfiguration.inputs?.[0].id, 'db_type');
			assert.strictEqual(result.mcpServerConfiguration.inputs?.[0].type, McpServerVariableType.PICK);
			assert.deepStrictEqual(result.mcpServerConfiguration.inputs?.[0].options, ['postgres', 'mysql', 'mongodb', 'redis']);
		});

		test('Docker package arguments without values should create input variables (GitHub issue #266106)', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				packages: [{
					registryType: RegistryType.DOCKER,
					transport: { type: TransportType.STDIO },
					identifier: 'example/database-manager-mcp',
					version: '3.1.0',
					packageArguments: [{
						type: 'named',
						name: '--host',
						description: 'Database host',
						default: 'localhost',
						isRequired: true,
						isRepeated: false
						// Note: No 'value' field - should create input variable
					}, {
						type: 'positional',
						valueHint: 'database_name',
						description: 'Name of the database to connect to',
						isRequired: true,
						isRepeated: false
						// Note: No 'value' field - should create input variable
					}]
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.DOCKER);

			// BUG: Currently named args without value are ignored, positional uses value_hint as literal
			// Should create input variables for both arguments
			assert.strictEqual(result.mcpServerConfiguration.inputs?.length, 2);

			const hostInput = result.mcpServerConfiguration.inputs?.find((i: IMcpServerVariable) => i.id === 'host');
			assert.strictEqual(hostInput?.description, 'Database host');
			assert.strictEqual(hostInput?.default, 'localhost');
			assert.strictEqual(hostInput?.type, McpServerVariableType.PROMPT);

			const dbNameInput = result.mcpServerConfiguration.inputs?.find((i: IMcpServerVariable) => i.id === 'database_name');
			assert.strictEqual(dbNameInput?.description, 'Name of the database to connect to');
			assert.strictEqual(dbNameInput?.type, McpServerVariableType.PROMPT);

			// Args should use input variable interpolation
			if (result.mcpServerConfiguration.config.type === McpServerType.LOCAL) {
				assert.deepStrictEqual(result.mcpServerConfiguration.config.args, [
					'run', '-i', '--rm',
					'example/database-manager-mcp:3.1.0',
					'--host', '${input:host}',
					'${input:database_name}'
				]);
			}
		});

		test('Docker Hub backward compatibility', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				packages: [{
					registryType: RegistryType.DOCKER,
					identifier: 'example/test-image',
					transport: { type: TransportType.STDIO },
					version: '1.0.0'
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.DOCKER);

			assert.strictEqual(result.mcpServerConfiguration.config.type, McpServerType.LOCAL);
			if (result.mcpServerConfiguration.config.type === McpServerType.LOCAL) {
				assert.strictEqual(result.mcpServerConfiguration.config.command, 'docker');
				assert.deepStrictEqual(result.mcpServerConfiguration.config.args, [
					'run', '-i', '--rm',
					'example/test-image:1.0.0'
				]);
			}
		});
	});

	suite('NuGet Package Tests', () => {
		test('basic NuGet package configuration', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				packages: [{
					registryType: RegistryType.NUGET,
					transport: { type: TransportType.STDIO },
					registryBaseUrl: 'https://api.nuget.org',
					identifier: 'Knapcode.SampleMcpServer',
					version: '0.5.0',
					environmentVariables: [{
						name: 'WEATHER_CHOICES',
						value: 'sunny,cloudy,rainy'
					}]
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.NUGET);

			assert.strictEqual(result.mcpServerConfiguration.config.type, McpServerType.LOCAL);
			if (result.mcpServerConfiguration.config.type === McpServerType.LOCAL) {
				assert.strictEqual(result.mcpServerConfiguration.config.command, 'dnx');
				assert.deepStrictEqual(result.mcpServerConfiguration.config.args, ['Knapcode.SampleMcpServer@0.5.0', '--yes']);
				assert.deepStrictEqual(result.mcpServerConfiguration.config.env, { 'WEATHER_CHOICES': 'sunny,cloudy,rainy' });
			}
		});

		test('NuGet package with package arguments', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				packages: [{
					registryType: RegistryType.NUGET,
					transport: { type: TransportType.STDIO },
					identifier: 'Knapcode.SampleMcpServer',
					version: '0.4.0-beta',
					packageArguments: [{
						type: 'positional',
						value: 'mcp',
						valueHint: 'command',
						isRepeated: false
					}, {
						type: 'positional',
						value: 'start',
						valueHint: 'action',
						isRepeated: false
					}]
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.NUGET);

			if (result.mcpServerConfiguration.config.type === McpServerType.LOCAL) {
				assert.deepStrictEqual(result.mcpServerConfiguration.config.args, [
					'Knapcode.SampleMcpServer@0.4.0-beta',
					'--yes',
					'--',
					'mcp',
					'start'
				]);
			}
		});
	});

	suite('Remote Server Tests', () => {
		test('SSE remote server configuration', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				remotes: [{
					type: TransportType.SSE,
					url: 'http://mcp-fs.anonymous.modelcontextprotocol.io/sse'
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.REMOTE);

			assert.strictEqual(result.mcpServerConfiguration.config.type, McpServerType.REMOTE);
			if (result.mcpServerConfiguration.config.type === McpServerType.REMOTE) {
				assert.strictEqual(result.mcpServerConfiguration.config.url, 'http://mcp-fs.anonymous.modelcontextprotocol.io/sse');
				assert.strictEqual(result.mcpServerConfiguration.config.headers, undefined);
			}
		});

		test('SSE remote server with headers and variables', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				remotes: [{
					type: TransportType.SSE,
					url: 'https://mcp.anonymous.modelcontextprotocol.io/sse',
					headers: [{
						name: 'X-API-Key',
						value: '{api_key}',
						variables: {
							api_key: {
								description: 'API key for authentication',
								isRequired: true,
								isSecret: true
							}
						}
					}, {
						name: 'X-Region',
						value: 'us-east-1'
					}]
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.REMOTE);

			assert.strictEqual(result.mcpServerConfiguration.config.type, McpServerType.REMOTE);
			if (result.mcpServerConfiguration.config.type === McpServerType.REMOTE) {
				assert.deepStrictEqual(result.mcpServerConfiguration.config.headers, {
					'X-API-Key': '${input:api_key}',
					'X-Region': 'us-east-1'
				});
			}
			assert.strictEqual(result.mcpServerConfiguration.inputs?.length, 1);
			assert.strictEqual(result.mcpServerConfiguration.inputs?.[0].id, 'api_key');
			assert.strictEqual(result.mcpServerConfiguration.inputs?.[0].password, true);
		});

		test('streamable HTTP remote server', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				remotes: [{
					type: TransportType.STREAMABLE_HTTP,
					url: 'https://mcp.anonymous.modelcontextprotocol.io/http'
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.REMOTE);

			assert.strictEqual(result.mcpServerConfiguration.config.type, McpServerType.REMOTE);
			if (result.mcpServerConfiguration.config.type === McpServerType.REMOTE) {
				assert.strictEqual(result.mcpServerConfiguration.config.url, 'https://mcp.anonymous.modelcontextprotocol.io/http');
			}
		});

		test('remote headers without values should create input variables', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				remotes: [{
					type: TransportType.SSE,
					url: 'https://api.example.com/mcp',
					headers: [{
						name: 'Authorization',
						description: 'API token for authentication',
						isSecret: true,
						isRequired: true
						// Note: No 'value' field - should create input variable
					}, {
						name: 'X-Custom-Header',
						description: 'Custom header value',
						default: 'default-value',
						choices: ['option1', 'option2', 'option3']
						// Note: No 'value' field - should create input variable with choices
					}]
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.REMOTE);

			assert.strictEqual(result.mcpServerConfiguration.config.type, McpServerType.REMOTE);
			if (result.mcpServerConfiguration.config.type === McpServerType.REMOTE) {
				assert.strictEqual(result.mcpServerConfiguration.config.url, 'https://api.example.com/mcp');
				assert.deepStrictEqual(result.mcpServerConfiguration.config.headers, {
					'Authorization': '${input:Authorization}',
					'X-Custom-Header': '${input:X-Custom-Header}'
				});
			}

			// Should create input variables for headers without values
			assert.strictEqual(result.mcpServerConfiguration.inputs?.length, 2);

			const authInput = result.mcpServerConfiguration.inputs?.find((i: IMcpServerVariable) => i.id === 'Authorization');
			assert.strictEqual(authInput?.description, 'API token for authentication');
			assert.strictEqual(authInput?.password, true);
			assert.strictEqual(authInput?.type, McpServerVariableType.PROMPT);

			const customInput = result.mcpServerConfiguration.inputs?.find((i: IMcpServerVariable) => i.id === 'X-Custom-Header');
			assert.strictEqual(customInput?.description, 'Custom header value');
			assert.strictEqual(customInput?.default, 'default-value');
			assert.strictEqual(customInput?.type, McpServerVariableType.PICK);
			assert.deepStrictEqual(customInput?.options, ['option1', 'option2', 'option3']);
		});
	});

	suite('Variable Interpolation Tests', () => {
		test('multiple variables in single value', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				packages: [{
					registryType: RegistryType.NODE,
					identifier: 'test-server',
					transport: { type: TransportType.STDIO },
					version: '1.0.0',
					environmentVariables: [{
						name: 'CONNECTION_STRING',
						value: 'server={host};port={port};database={db_name}',
						variables: {
							host: {
								description: 'Database host',
								default: 'localhost'
							},
							port: {
								description: 'Database port',
								format: 'number',
								default: '5432'
							},
							db_name: {
								description: 'Database name',
								isRequired: true
							}
						}
					}]
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.NODE);

			if (result.mcpServerConfiguration.config.type === McpServerType.LOCAL) {
				assert.deepStrictEqual(result.mcpServerConfiguration.config.env, {
					'CONNECTION_STRING': 'server=${input:host};port=${input:port};database=${input:db_name}'
				});
			}
			assert.strictEqual(result.mcpServerConfiguration.inputs?.length, 3);

			const hostInput = result.mcpServerConfiguration.inputs?.find((i: IMcpServerVariable) => i.id === 'host');
			assert.strictEqual(hostInput?.default, 'localhost');
			assert.strictEqual(hostInput?.type, McpServerVariableType.PROMPT);

			const portInput = result.mcpServerConfiguration.inputs?.find((i: IMcpServerVariable) => i.id === 'port');
			assert.strictEqual(portInput?.default, '5432');

			const dbNameInput = result.mcpServerConfiguration.inputs?.find((i: IMcpServerVariable) => i.id === 'db_name');
			assert.strictEqual(dbNameInput?.description, 'Database name');
		});

		test('variable with choices creates pick input', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				packages: [{
					registryType: RegistryType.NODE,
					identifier: 'test-server',
					transport: { type: TransportType.STDIO },
					version: '1.0.0',
					runtimeArguments: [{
						type: 'named',
						name: '--log-level',
						value: '{level}',
						isRepeated: false,
						variables: {
							level: {
								description: 'Log level',
								choices: ['debug', 'info', 'warn', 'error'],
								default: 'info'
							}
						}
					}]
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.NODE);

			assert.strictEqual(result.mcpServerConfiguration.inputs?.length, 1);
			assert.strictEqual(result.mcpServerConfiguration.inputs?.[0].type, McpServerVariableType.PICK);
			assert.deepStrictEqual(result.mcpServerConfiguration.inputs?.[0].options, ['debug', 'info', 'warn', 'error']);
			assert.strictEqual(result.mcpServerConfiguration.inputs?.[0].default, 'info');
		});

		test('variables in package arguments', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				packages: [{
					registryType: RegistryType.DOCKER,
					identifier: 'test-image',
					transport: { type: TransportType.STDIO },
					version: '1.0.0',
					packageArguments: [{
						type: 'named',
						name: '--host',
						value: '{db_host}',
						isRepeated: false,
						variables: {
							db_host: {
								description: 'Database host',
								default: 'localhost'
							}
						}
					}, {
						type: 'positional',
						value: '{database_name}',
						valueHint: 'database_name',
						isRepeated: false,
						variables: {
							database_name: {
								description: 'Name of the database to connect to',
								isRequired: true
							}
						}
					}]
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.DOCKER);

			if (result.mcpServerConfiguration.config.type === McpServerType.LOCAL) {
				assert.deepStrictEqual(result.mcpServerConfiguration.config.args, [
					'run', '-i', '--rm',
					'test-image:1.0.0',
					'--host', '${input:db_host}',
					'${input:database_name}'
				]);
			}
			assert.strictEqual(result.mcpServerConfiguration.inputs?.length, 2);
		});

		test('positional arguments with value_hint should create input variables (GitHub issue #266106)', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				packages: [{
					registryType: RegistryType.NODE,
					identifier: '@example/math-tool',
					transport: { type: TransportType.STDIO },
					version: '2.0.1',
					packageArguments: [{
						type: 'positional',
						valueHint: 'calculation_type',
						description: 'Type of calculation to enable',
						isRequired: true,
						isRepeated: false
						// Note: No 'value' field, only value_hint - should create input variable
					}]
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.NODE);

			// BUG: Currently value_hint is used as literal value instead of creating input variable
			// Should create input variable instead
			assert.strictEqual(result.mcpServerConfiguration.inputs?.length, 1);
			assert.strictEqual(result.mcpServerConfiguration.inputs?.[0].id, 'calculation_type');
			assert.strictEqual(result.mcpServerConfiguration.inputs?.[0].description, 'Type of calculation to enable');
			assert.strictEqual(result.mcpServerConfiguration.inputs?.[0].type, McpServerVariableType.PROMPT);

			// Args should use input variable interpolation
			if (result.mcpServerConfiguration.config.type === McpServerType.LOCAL) {
				assert.deepStrictEqual(result.mcpServerConfiguration.config.args, [
					'@example/math-tool@2.0.1',
					'${input:calculation_type}'
				]);
			}
		});
	});

	suite('Edge Cases and Error Handling', () => {
		test('empty manifest should throw error', () => {
			const manifest: IGalleryMcpServerConfiguration = {};

			assert.throws(() => {
				service.getMcpServerConfigurationFromManifest(manifest, RegistryType.NODE);
			}, /No server package found/);
		});

		test('manifest with no matching package type should use first package', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				packages: [{
					registryType: RegistryType.PYTHON,
					transport: { type: TransportType.STDIO },
					identifier: 'python-server',
					version: '1.0.0'
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.NODE);

			assert.strictEqual(result.mcpServerConfiguration.config.type, McpServerType.LOCAL);
			if (result.mcpServerConfiguration.config.type === McpServerType.LOCAL) {
				assert.strictEqual(result.mcpServerConfiguration.config.command, 'uvx'); // Python command since that's the package type
				assert.deepStrictEqual(result.mcpServerConfiguration.config.args, ['python-server==1.0.0']);
			}
		});

		test('manifest with matching package type should use that package', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				packages: [{
					registryType: RegistryType.PYTHON,
					transport: { type: TransportType.STDIO },
					identifier: 'python-server',
					version: '1.0.0'
				}, {
					registryType: RegistryType.NODE,
					transport: { type: TransportType.STDIO },
					identifier: 'node-server',
					version: '2.0.0'
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.NODE);

			if (result.mcpServerConfiguration.config.type === McpServerType.LOCAL) {
				assert.strictEqual(result.mcpServerConfiguration.config.command, 'npx');
				assert.deepStrictEqual(result.mcpServerConfiguration.config.args, ['node-server@2.0.0']);
			}
		});

		test('undefined environment variables should be omitted', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				packages: [{
					registryType: RegistryType.NODE,
					transport: { type: TransportType.STDIO },
					identifier: 'test-server',
					version: '1.0.0'
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.NODE);

			if (result.mcpServerConfiguration.config.type === McpServerType.LOCAL) {
				assert.strictEqual(result.mcpServerConfiguration.config.env, undefined);
			}
		});

		test('named argument without value should only add name', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				packages: [{
					registryType: RegistryType.NODE,
					transport: { type: TransportType.STDIO },
					identifier: 'test-server',
					version: '1.0.0',
					runtimeArguments: [{
						type: 'named',
						name: '--verbose',
						isRepeated: false
					}]
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.NODE);

			if (result.mcpServerConfiguration.config.type === McpServerType.LOCAL) {
				assert.deepStrictEqual(result.mcpServerConfiguration.config.args, ['--verbose', 'test-server@1.0.0']);
			}
		});

		test('positional argument with undefined value should use value_hint', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				packages: [{
					registryType: RegistryType.NODE,
					identifier: 'test-server',
					transport: { type: TransportType.STDIO },
					version: '1.0.0',
					packageArguments: [{
						type: 'positional',
						valueHint: 'target_directory',
						isRepeated: false
					}]
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.NODE);

			if (result.mcpServerConfiguration.config.type === McpServerType.LOCAL) {
				assert.deepStrictEqual(result.mcpServerConfiguration.config.args, ['test-server@1.0.0', 'target_directory']);
			}
		});

		test('named argument with no name should generate notice', () => {
			const manifest = {
				packages: [{
					registryType: RegistryType.NODE,
					identifier: 'test-server',
					transport: { type: TransportType.STDIO },
					version: '1.0.0',
					runtimeArguments: [{
						type: 'named',
						value: 'some-value',
						isRepeated: false
					}]
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest as IGalleryMcpServerConfiguration, RegistryType.NODE);

			// Should generate a notice about the missing name
			assert.strictEqual(result.notices.length, 1);
			assert.ok(result.notices[0].includes('Named argument is missing a name'));
			assert.ok(result.notices[0].includes('some-value')); // Should include the argument details in JSON format

			if (result.mcpServerConfiguration.config.type === McpServerType.LOCAL) {
				assert.deepStrictEqual(result.mcpServerConfiguration.config.args, ['test-server@1.0.0']);
			}
		});

		test('named argument with empty name should generate notice', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				packages: [{
					registryType: RegistryType.NODE,
					identifier: 'test-server',
					transport: { type: TransportType.STDIO },
					version: '1.0.0',
					runtimeArguments: [{
						type: 'named',
						name: '',
						value: 'some-value',
						isRepeated: false
					}]
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.NODE);

			// Should generate a notice about the missing name
			assert.strictEqual(result.notices.length, 1);
			assert.ok(result.notices[0].includes('Named argument is missing a name'));
			assert.ok(result.notices[0].includes('some-value')); // Should include the argument details in JSON format

			if (result.mcpServerConfiguration.config.type === McpServerType.LOCAL) {
				assert.deepStrictEqual(result.mcpServerConfiguration.config.args, ['test-server@1.0.0']);
			}
		});
	});

	suite('Variable Processing Order', () => {
		test('should use explicit variables instead of auto-generating when both are possible', () => {
			const manifest: IGalleryMcpServerConfiguration = {
				packages: [{
					registryType: RegistryType.NODE,
					identifier: 'test-server',
					transport: { type: TransportType.STDIO },
					version: '1.0.0',
					environmentVariables: [{
						name: 'API_KEY',
						value: 'Bearer {api_key}',
						description: 'Should not be used', // This should be ignored since we have explicit variables
						variables: {
							api_key: {
								description: 'Your API key',
								isSecret: true
							}
						}
					}]
				}]
			};

			const result = service.getMcpServerConfigurationFromManifest(manifest, RegistryType.NODE);

			assert.strictEqual(result.mcpServerConfiguration.inputs?.length, 1);
			assert.strictEqual(result.mcpServerConfiguration.inputs?.[0].id, 'api_key');
			assert.strictEqual(result.mcpServerConfiguration.inputs?.[0].description, 'Your API key');
			assert.strictEqual(result.mcpServerConfiguration.inputs?.[0].password, true);

			if (result.mcpServerConfiguration.config.type === McpServerType.LOCAL) {
				assert.strictEqual(result.mcpServerConfiguration.config.env?.['API_KEY'], 'Bearer ${input:api_key}');
			}
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/menubar/common/menubar.ts]---
Location: vscode-main/src/vs/platform/menubar/common/menubar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../base/common/uri.js';

export interface ICommonMenubarService {
	updateMenubar(windowId: number, menuData: IMenubarData): Promise<void>;
}

export interface IMenubarData {
	menus: { [id: string]: IMenubarMenu };
	keybindings: { [id: string]: IMenubarKeybinding };
}

export interface IMenubarMenu {
	items: Array<MenubarMenuItem>;
}

export interface IMenubarKeybinding {
	label: string;
	userSettingsLabel?: string;
	isNative?: boolean; // Assumed true if missing
}

export interface IMenubarMenuItemAction {
	id: string;
	label: string;
	checked?: boolean; // Assumed false if missing
	enabled?: boolean; // Assumed true if missing
}

export interface IMenubarMenuRecentItemAction {
	id: string;
	label: string;
	uri: URI;
	remoteAuthority?: string;
	enabled?: boolean;
}

export interface IMenubarMenuItemSubmenu {
	id: string;
	label: string;
	submenu: IMenubarMenu;
}

export interface IMenubarMenuItemSeparator {
	id: 'vscode.menubar.separator';
}

export type MenubarMenuItem = IMenubarMenuItemAction | IMenubarMenuItemSubmenu | IMenubarMenuItemSeparator | IMenubarMenuRecentItemAction;

export function isMenubarMenuItemSubmenu(menuItem: MenubarMenuItem): menuItem is IMenubarMenuItemSubmenu {
	return (<IMenubarMenuItemSubmenu>menuItem).submenu !== undefined;
}

export function isMenubarMenuItemSeparator(menuItem: MenubarMenuItem): menuItem is IMenubarMenuItemSeparator {
	return (<IMenubarMenuItemSeparator>menuItem).id === 'vscode.menubar.separator';
}

export function isMenubarMenuItemRecentAction(menuItem: MenubarMenuItem): menuItem is IMenubarMenuRecentItemAction {
	return (<IMenubarMenuRecentItemAction>menuItem).uri !== undefined;
}

export function isMenubarMenuItemAction(menuItem: MenubarMenuItem): menuItem is IMenubarMenuItemAction {
	return !isMenubarMenuItemSubmenu(menuItem) && !isMenubarMenuItemSeparator(menuItem) && !isMenubarMenuItemRecentAction(menuItem);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/menubar/electron-browser/menubar.ts]---
Location: vscode-main/src/vs/platform/menubar/electron-browser/menubar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../instantiation/common/instantiation.js';
import { ICommonMenubarService } from '../common/menubar.js';

export const IMenubarService = createDecorator<IMenubarService>('menubarService');

export interface IMenubarService extends ICommonMenubarService {
	readonly _serviceBrand: undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/menubar/electron-main/menubar.ts]---
Location: vscode-main/src/vs/platform/menubar/electron-main/menubar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { app, BrowserWindow, BaseWindow, KeyboardEvent, Menu, MenuItem, MenuItemConstructorOptions, WebContents } from 'electron';
import { WorkbenchActionExecutedClassification, WorkbenchActionExecutedEvent } from '../../../base/common/actions.js';
import { RunOnceScheduler } from '../../../base/common/async.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { mnemonicMenuLabel } from '../../../base/common/labels.js';
import { isMacintosh, language } from '../../../base/common/platform.js';
import { URI } from '../../../base/common/uri.js';
import * as nls from '../../../nls.js';
import { IAuxiliaryWindowsMainService } from '../../auxiliaryWindow/electron-main/auxiliaryWindows.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IEnvironmentMainService } from '../../environment/electron-main/environmentMainService.js';
import { ILifecycleMainService } from '../../lifecycle/electron-main/lifecycleMainService.js';
import { ILogService } from '../../log/common/log.js';
import { IMenubarData, IMenubarKeybinding, IMenubarMenu, IMenubarMenuRecentItemAction, isMenubarMenuItemAction, isMenubarMenuItemRecentAction, isMenubarMenuItemSeparator, isMenubarMenuItemSubmenu, MenubarMenuItem } from '../common/menubar.js';
import { INativeHostMainService } from '../../native/electron-main/nativeHostMainService.js';
import { IProductService } from '../../product/common/productService.js';
import { IStateService } from '../../state/node/state.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { IUpdateService, StateType } from '../../update/common/update.js';
import { INativeRunActionInWindowRequest, INativeRunKeybindingInWindowRequest, IWindowOpenable, hasNativeMenu } from '../../window/common/window.js';
import { IWindowsCountChangedEvent, IWindowsMainService, OpenContext } from '../../windows/electron-main/windows.js';
import { IWorkspacesHistoryMainService } from '../../workspaces/electron-main/workspacesHistoryMainService.js';
import { Disposable } from '../../../base/common/lifecycle.js';

const telemetryFrom = 'menu';

interface IMenuItemClickHandler {
	inDevTools: (contents: WebContents) => void;
	inNoWindow: () => void;
}

type IMenuItemInvocation = (
	{ type: 'commandId'; commandId: string }
	| { type: 'keybinding'; userSettingsLabel: string }
);

interface IMenuItemWithKeybinding {
	userSettingsLabel?: string;
}

export class Menubar extends Disposable {

	private static readonly lastKnownMenubarStorageKey = 'lastKnownMenubarData';

	private willShutdown: boolean | undefined;
	private appMenuInstalled: boolean | undefined;
	private closedLastWindow: boolean;
	private noActiveMainWindow: boolean;
	private showNativeMenu: boolean;

	private menuUpdater: RunOnceScheduler;
	private menuGC: RunOnceScheduler;

	// Array to keep menus around so that GC doesn't cause crash as explained in #55347
	// TODO@sbatten Remove this when fixed upstream by Electron
	private oldMenus: Menu[];

	private menubarMenus: { [id: string]: IMenubarMenu };

	private keybindings: { [commandId: string]: IMenubarKeybinding };

	private readonly fallbackMenuHandlers: { [id: string]: (menuItem: MenuItem, browserWindow: BaseWindow | undefined, event: KeyboardEvent) => void } = Object.create(null);

	constructor(
		@IUpdateService private readonly updateService: IUpdateService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IWindowsMainService private readonly windowsMainService: IWindowsMainService,
		@IEnvironmentMainService private readonly environmentMainService: IEnvironmentMainService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IWorkspacesHistoryMainService private readonly workspacesHistoryMainService: IWorkspacesHistoryMainService,
		@IStateService private readonly stateService: IStateService,
		@ILifecycleMainService private readonly lifecycleMainService: ILifecycleMainService,
		@ILogService private readonly logService: ILogService,
		@INativeHostMainService private readonly nativeHostMainService: INativeHostMainService,
		@IProductService private readonly productService: IProductService,
		@IAuxiliaryWindowsMainService private readonly auxiliaryWindowsMainService: IAuxiliaryWindowsMainService
	) {
		super();

		this.menuUpdater = new RunOnceScheduler(() => this.doUpdateMenu(), 0);

		this.menuGC = new RunOnceScheduler(() => { this.oldMenus = []; }, 10000);

		this.menubarMenus = Object.create(null);
		this.keybindings = Object.create(null);
		this.showNativeMenu = hasNativeMenu(configurationService);

		if (isMacintosh || this.showNativeMenu) {
			this.restoreCachedMenubarData();
		}

		this.addFallbackHandlers();

		this.closedLastWindow = false;
		this.noActiveMainWindow = false;

		this.oldMenus = [];

		this.install();

		this.registerListeners();
	}

	private restoreCachedMenubarData() {
		const menubarData = this.stateService.getItem<IMenubarData>(Menubar.lastKnownMenubarStorageKey);
		if (menubarData) {
			if (menubarData.menus) {
				this.menubarMenus = menubarData.menus;
			}

			if (menubarData.keybindings) {
				this.keybindings = menubarData.keybindings;
			}
		}
	}

	private addFallbackHandlers(): void {

		// File Menu Items
		this.fallbackMenuHandlers['workbench.action.files.newUntitledFile'] = (menuItem, win, event) => {
			if (!this.runActionInRenderer({ type: 'commandId', commandId: 'workbench.action.files.newUntitledFile' })) { // this is one of the few supported actions when aux window has focus
				this.windowsMainService.openEmptyWindow({ context: OpenContext.MENU, contextWindowId: win?.id });
			}
		};
		this.fallbackMenuHandlers['workbench.action.newWindow'] = (menuItem, win, event) => this.windowsMainService.openEmptyWindow({ context: OpenContext.MENU, contextWindowId: win?.id });
		this.fallbackMenuHandlers['workbench.action.files.openFileFolder'] = (menuItem, win, event) => this.nativeHostMainService.pickFileFolderAndOpen(undefined, { forceNewWindow: this.isOptionClick(event), telemetryExtraData: { from: telemetryFrom } });
		this.fallbackMenuHandlers['workbench.action.files.openFolder'] = (menuItem, win, event) => this.nativeHostMainService.pickFolderAndOpen(undefined, { forceNewWindow: this.isOptionClick(event), telemetryExtraData: { from: telemetryFrom } });
		this.fallbackMenuHandlers['workbench.action.openWorkspace'] = (menuItem, win, event) => this.nativeHostMainService.pickWorkspaceAndOpen(undefined, { forceNewWindow: this.isOptionClick(event), telemetryExtraData: { from: telemetryFrom } });

		// Recent Menu Items
		this.fallbackMenuHandlers['workbench.action.clearRecentFiles'] = () => this.workspacesHistoryMainService.clearRecentlyOpened({ confirm: true /* ask for confirmation */ });

		// Help Menu Items
		const youTubeUrl = this.productService.youTubeUrl;
		if (youTubeUrl) {
			this.fallbackMenuHandlers['workbench.action.openYouTubeUrl'] = () => this.openUrl(youTubeUrl, 'openYouTubeUrl');
		}

		const requestFeatureUrl = this.productService.requestFeatureUrl;
		if (requestFeatureUrl) {
			this.fallbackMenuHandlers['workbench.action.openRequestFeatureUrl'] = () => this.openUrl(requestFeatureUrl, 'openUserVoiceUrl');
		}

		const reportIssueUrl = this.productService.reportIssueUrl;
		if (reportIssueUrl) {
			this.fallbackMenuHandlers['workbench.action.openIssueReporter'] = () => this.openUrl(reportIssueUrl, 'openReportIssues');
		}

		const licenseUrl = this.productService.licenseUrl;
		if (licenseUrl) {
			this.fallbackMenuHandlers['workbench.action.openLicenseUrl'] = () => {
				if (language) {
					const queryArgChar = licenseUrl.indexOf('?') > 0 ? '&' : '?';
					this.openUrl(`${licenseUrl}${queryArgChar}lang=${language}`, 'openLicenseUrl');
				} else {
					this.openUrl(licenseUrl, 'openLicenseUrl');
				}
			};
		}

		const privacyStatementUrl = this.productService.privacyStatementUrl;
		if (privacyStatementUrl && licenseUrl) {
			this.fallbackMenuHandlers['workbench.action.openPrivacyStatementUrl'] = () => {
				this.openUrl(privacyStatementUrl, 'openPrivacyStatement');
			};
		}
	}

	private registerListeners(): void {

		// Keep flag when app quits
		this._register(this.lifecycleMainService.onWillShutdown(() => this.willShutdown = true));

		// Listen to some events from window service to update menu
		this._register(this.windowsMainService.onDidChangeWindowsCount(e => this.onDidChangeWindowsCount(e)));
		this._register(this.nativeHostMainService.onDidBlurMainWindow(() => this.onDidChangeWindowFocus()));
		this._register(this.nativeHostMainService.onDidFocusMainWindow(() => this.onDidChangeWindowFocus()));
	}

	private get currentEnableMenuBarMnemonics(): boolean {
		const enableMenuBarMnemonics = this.configurationService.getValue('window.enableMenuBarMnemonics');
		if (typeof enableMenuBarMnemonics !== 'boolean') {
			return true;
		}

		return enableMenuBarMnemonics;
	}

	private get currentEnableNativeTabs(): boolean {
		if (!isMacintosh) {
			return false;
		}

		const enableNativeTabs = this.configurationService.getValue('window.nativeTabs');
		if (typeof enableNativeTabs !== 'boolean') {
			return false;
		}
		return enableNativeTabs;
	}

	updateMenu(menubarData: IMenubarData, windowId: number) {
		this.menubarMenus = menubarData.menus;
		this.keybindings = menubarData.keybindings;

		// Save off new menu and keybindings
		this.stateService.setItem(Menubar.lastKnownMenubarStorageKey, menubarData);

		this.scheduleUpdateMenu();
	}


	private scheduleUpdateMenu(): void {
		this.menuUpdater.schedule(); // buffer multiple attempts to update the menu
	}

	private doUpdateMenu(): void {

		// Due to limitations in Electron, it is not possible to update menu items dynamically. The suggested
		// workaround from Electron is to set the application menu again.
		// See also https://github.com/electron/electron/issues/846
		//
		// Run delayed to prevent updating menu while it is open
		if (!this.willShutdown) {
			setTimeout(() => {
				if (!this.willShutdown) {
					this.install();
				}
			}, 10 /* delay this because there is an issue with updating a menu when it is open */);
		}
	}

	private onDidChangeWindowsCount(e: IWindowsCountChangedEvent): void {
		if (!isMacintosh) {
			return;
		}

		// Update menu if window count goes from N > 0 or 0 > N to update menu item enablement
		if ((e.oldCount === 0 && e.newCount > 0) || (e.oldCount > 0 && e.newCount === 0)) {
			this.closedLastWindow = e.newCount === 0;
			this.scheduleUpdateMenu();
		}
	}

	private onDidChangeWindowFocus(): void {
		if (!isMacintosh) {
			return;
		}

		const focusedWindow = BrowserWindow.getFocusedWindow();
		this.noActiveMainWindow = !focusedWindow || !!this.auxiliaryWindowsMainService.getWindowByWebContents(focusedWindow.webContents);
		this.scheduleUpdateMenu();
	}

	private install(): void {
		// Store old menu in our array to avoid GC to collect the menu and crash. See #55347
		// TODO@sbatten Remove this when fixed upstream by Electron
		const oldMenu = Menu.getApplicationMenu();
		if (oldMenu) {
			this.oldMenus.push(oldMenu);
		}

		// If we don't have a menu yet, set it to null to avoid the electron menu.
		// This should only happen on the first launch ever
		if (Object.keys(this.menubarMenus).length === 0) {
			this.doSetApplicationMenu(isMacintosh ? new Menu() : null);
			return;
		}

		// Menus
		const menubar = new Menu();

		// Mac: Application
		let macApplicationMenuItem: MenuItem;
		if (isMacintosh) {
			const applicationMenu = new Menu();
			macApplicationMenuItem = new MenuItem({ label: this.productService.nameShort, submenu: applicationMenu });
			this.setMacApplicationMenu(applicationMenu);
			menubar.append(macApplicationMenuItem);
		}

		// Mac: Dock
		if (isMacintosh && !this.appMenuInstalled) {
			this.appMenuInstalled = true;

			const dockMenu = new Menu();
			dockMenu.append(new MenuItem({ label: this.mnemonicLabel(nls.localize({ key: 'miNewWindow', comment: ['&& denotes a mnemonic'] }, "New &&Window")), click: () => this.windowsMainService.openEmptyWindow({ context: OpenContext.DOCK }) }));

			app.dock!.setMenu(dockMenu);
		}

		// File
		if (this.shouldDrawMenu('File')) {
			const fileMenu = new Menu();
			const fileMenuItem = new MenuItem({ label: this.mnemonicLabel(nls.localize({ key: 'mFile', comment: ['&& denotes a mnemonic'] }, "&&File")), submenu: fileMenu });
			this.setMenuById(fileMenu, 'File');
			menubar.append(fileMenuItem);
		}

		// Edit
		if (this.shouldDrawMenu('Edit')) {
			const editMenu = new Menu();
			const editMenuItem = new MenuItem({ label: this.mnemonicLabel(nls.localize({ key: 'mEdit', comment: ['&& denotes a mnemonic'] }, "&&Edit")), submenu: editMenu });
			this.setMenuById(editMenu, 'Edit');
			menubar.append(editMenuItem);
		}

		// Selection
		if (this.shouldDrawMenu('Selection')) {
			const selectionMenu = new Menu();
			const selectionMenuItem = new MenuItem({ label: this.mnemonicLabel(nls.localize({ key: 'mSelection', comment: ['&& denotes a mnemonic'] }, "&&Selection")), submenu: selectionMenu });
			this.setMenuById(selectionMenu, 'Selection');
			menubar.append(selectionMenuItem);
		}

		// View
		if (this.shouldDrawMenu('View')) {
			const viewMenu = new Menu();
			const viewMenuItem = new MenuItem({ label: this.mnemonicLabel(nls.localize({ key: 'mView', comment: ['&& denotes a mnemonic'] }, "&&View")), submenu: viewMenu });
			this.setMenuById(viewMenu, 'View');
			menubar.append(viewMenuItem);
		}

		// Go
		if (this.shouldDrawMenu('Go')) {
			const gotoMenu = new Menu();
			const gotoMenuItem = new MenuItem({ label: this.mnemonicLabel(nls.localize({ key: 'mGoto', comment: ['&& denotes a mnemonic'] }, "&&Go")), submenu: gotoMenu });
			this.setMenuById(gotoMenu, 'Go');
			menubar.append(gotoMenuItem);
		}

		// Debug
		if (this.shouldDrawMenu('Run')) {
			const debugMenu = new Menu();
			const debugMenuItem = new MenuItem({ label: this.mnemonicLabel(nls.localize({ key: 'mRun', comment: ['&& denotes a mnemonic'] }, "&&Run")), submenu: debugMenu });
			this.setMenuById(debugMenu, 'Run');
			menubar.append(debugMenuItem);
		}

		// Terminal
		if (this.shouldDrawMenu('Terminal')) {
			const terminalMenu = new Menu();
			const terminalMenuItem = new MenuItem({ label: this.mnemonicLabel(nls.localize({ key: 'mTerminal', comment: ['&& denotes a mnemonic'] }, "&&Terminal")), submenu: terminalMenu });
			this.setMenuById(terminalMenu, 'Terminal');
			menubar.append(terminalMenuItem);
		}

		// Mac: Window
		let macWindowMenuItem: MenuItem | undefined;
		if (this.shouldDrawMenu('Window')) {
			const windowMenu = new Menu();
			macWindowMenuItem = new MenuItem({ label: this.mnemonicLabel(nls.localize('mWindow', "Window")), submenu: windowMenu, role: 'window' });
			this.setMacWindowMenu(windowMenu);
		}

		if (macWindowMenuItem) {
			menubar.append(macWindowMenuItem);
		}

		// Help
		if (this.shouldDrawMenu('Help')) {
			const helpMenu = new Menu();
			const helpMenuItem = new MenuItem({ label: this.mnemonicLabel(nls.localize({ key: 'mHelp', comment: ['&& denotes a mnemonic'] }, "&&Help")), submenu: helpMenu, role: 'help' });
			this.setMenuById(helpMenu, 'Help');
			menubar.append(helpMenuItem);
		}

		if (menubar.items && menubar.items.length > 0) {
			this.doSetApplicationMenu(menubar);
		} else {
			this.doSetApplicationMenu(null);
		}

		// Dispose of older menus after some time
		this.menuGC.schedule();
	}

	private doSetApplicationMenu(menu: (Menu) | (null)): void {

		// Setting the application menu sets it to all opened windows,
		// but we currently do not support a menu in auxiliary windows,
		// so we need to unset it there.
		//
		// This is a bit ugly but `setApplicationMenu()` has some nice
		// behaviour we want:
		// - on macOS it is required because menus are application set
		// - we use `getApplicationMenu()` to access the current state
		// - new windows immediately get the same menu when opening
		//   reducing overall flicker for these

		Menu.setApplicationMenu(menu);

		if (menu) {
			for (const window of this.auxiliaryWindowsMainService.getWindows()) {
				window.win?.setMenu(null);
			}
		}
	}

	private setMacApplicationMenu(macApplicationMenu: Menu): void {
		const about = this.createMenuItem(nls.localize('mAbout', "About {0}", this.productService.nameLong), 'workbench.action.showAboutDialog');
		const checkForUpdates = this.getUpdateMenuItems();

		let preferences;
		if (this.shouldDrawMenu('Preferences')) {
			const preferencesMenu = new Menu();
			this.setMenuById(preferencesMenu, 'Preferences');
			preferences = new MenuItem({ label: this.mnemonicLabel(nls.localize({ key: 'miPreferences', comment: ['&& denotes a mnemonic'] }, "&&Preferences")), submenu: preferencesMenu });
		}

		const servicesMenu = new Menu();
		const services = new MenuItem({ label: nls.localize('mServices', "Services"), role: 'services', submenu: servicesMenu });
		const hide = new MenuItem({ label: nls.localize('mHide', "Hide {0}", this.productService.nameLong), role: 'hide', accelerator: 'Command+H' });
		const hideOthers = new MenuItem({ label: nls.localize('mHideOthers', "Hide Others"), role: 'hideOthers', accelerator: 'Command+Alt+H' });
		const showAll = new MenuItem({ label: nls.localize('mShowAll', "Show All"), role: 'unhide' });
		const quit = new MenuItem(this.likeAction('workbench.action.quit', {
			label: nls.localize('miQuit', "Quit {0}", this.productService.nameLong), click: async (item, window, event) => {
				const lastActiveWindow = this.windowsMainService.getLastActiveWindow();
				if (
					this.windowsMainService.getWindowCount() === 0 || 	// allow to quit when no more windows are open
					!!BrowserWindow.getFocusedWindow() ||				// allow to quit when window has focus (fix for https://github.com/microsoft/vscode/issues/39191)
					lastActiveWindow?.win?.isMinimized()				// allow to quit when window has no focus but is minimized (https://github.com/microsoft/vscode/issues/63000)
				) {
					const confirmed = await this.confirmBeforeQuit(event);
					if (confirmed) {
						this.nativeHostMainService.quit(undefined);
					}
				}
			}
		}));

		const actions = [about];
		actions.push(...checkForUpdates);

		if (preferences) {
			actions.push(...[
				__separator__(),
				preferences
			]);
		}

		actions.push(...[
			__separator__(),
			services,
			__separator__(),
			hide,
			hideOthers,
			showAll,
			__separator__(),
			quit
		]);

		actions.forEach(i => macApplicationMenu.append(i));
	}

	private async confirmBeforeQuit(event: KeyboardEvent): Promise<boolean> {
		if (this.windowsMainService.getWindowCount() === 0) {
			return true; // never confirm when no windows are opened
		}

		const confirmBeforeClose = this.configurationService.getValue<'always' | 'never' | 'keyboardOnly'>('window.confirmBeforeClose');
		if (confirmBeforeClose === 'always' || (confirmBeforeClose === 'keyboardOnly' && this.isKeyboardEvent(event))) {
			const { response } = await this.nativeHostMainService.showMessageBox(this.windowsMainService.getFocusedWindow()?.id, {
				type: 'question',
				buttons: [
					isMacintosh ? nls.localize({ key: 'quit', comment: ['&& denotes a mnemonic'] }, "&&Quit") : nls.localize({ key: 'exit', comment: ['&& denotes a mnemonic'] }, "&&Exit"),
					nls.localize('cancel', "Cancel")
				],
				message: isMacintosh ? nls.localize('quitMessageMac', "Are you sure you want to quit?") : nls.localize('quitMessage', "Are you sure you want to exit?")
			});

			return response === 0;
		}

		return true;
	}

	private shouldDrawMenu(menuId: string): boolean {
		if (!isMacintosh && !this.showNativeMenu) {
			return false; // We need to draw an empty menu to override the electron default
		}

		switch (menuId) {
			case 'File':
			case 'Help':
				if (isMacintosh) {
					return (this.windowsMainService.getWindowCount() === 0 && this.closedLastWindow) || (this.windowsMainService.getWindowCount() > 0 && this.noActiveMainWindow) || (!!this.menubarMenus && !!this.menubarMenus[menuId]);
				}

			case 'Window':
				if (isMacintosh) {
					return (this.windowsMainService.getWindowCount() === 0 && this.closedLastWindow) || (this.windowsMainService.getWindowCount() > 0 && this.noActiveMainWindow) || !!this.menubarMenus;
				}

			default:
				return this.windowsMainService.getWindowCount() > 0 && (!!this.menubarMenus && !!this.menubarMenus[menuId]);
		}
	}


	private setMenu(menu: Menu, items: Array<MenubarMenuItem>) {
		items.forEach((item: MenubarMenuItem) => {
			if (isMenubarMenuItemSeparator(item)) {
				menu.append(__separator__());
			} else if (isMenubarMenuItemSubmenu(item)) {
				const submenu = new Menu();
				const submenuItem = new MenuItem({ label: this.mnemonicLabel(item.label), submenu });
				this.setMenu(submenu, item.submenu.items);
				menu.append(submenuItem);
			} else if (isMenubarMenuItemRecentAction(item)) {
				menu.append(this.createOpenRecentMenuItem(item));
			} else if (isMenubarMenuItemAction(item)) {
				if (item.id === 'workbench.action.showAboutDialog') {
					this.insertCheckForUpdatesItems(menu);
				}

				if (isMacintosh) {
					if ((this.windowsMainService.getWindowCount() === 0 && this.closedLastWindow) ||
						(this.windowsMainService.getWindowCount() > 0 && this.noActiveMainWindow)) {
						// In the fallback scenario, we are either disabled or using a fallback handler
						if (this.fallbackMenuHandlers[item.id]) {
							menu.append(new MenuItem(this.likeAction(item.id, { label: this.mnemonicLabel(item.label), click: this.fallbackMenuHandlers[item.id] })));
						} else {
							menu.append(this.createMenuItem(item.label, item.id, false, item.checked));
						}
					} else {
						menu.append(this.createMenuItem(item.label, item.id, item.enabled !== false, !!item.checked));
					}
				} else {
					menu.append(this.createMenuItem(item.label, item.id, item.enabled !== false, !!item.checked));
				}
			}
		});
	}

	private setMenuById(menu: Menu, menuId: string): void {
		if (this.menubarMenus?.[menuId]) {
			this.setMenu(menu, this.menubarMenus[menuId].items);
		}
	}

	private insertCheckForUpdatesItems(menu: Menu) {
		const updateItems = this.getUpdateMenuItems();
		if (updateItems.length) {
			updateItems.forEach(i => menu.append(i));
			menu.append(__separator__());
		}
	}

	private createOpenRecentMenuItem(item: IMenubarMenuRecentItemAction): MenuItem {
		const revivedUri = URI.revive(item.uri);
		const commandId = item.id;
		const openable: IWindowOpenable =
			(commandId === 'openRecentFile') ? { fileUri: revivedUri } :
				(commandId === 'openRecentWorkspace') ? { workspaceUri: revivedUri } : { folderUri: revivedUri };

		return new MenuItem(this.likeAction(commandId, {
			label: item.label,
			click: async (menuItem, win, event) => {
				const openInNewWindow = this.isOptionClick(event);
				const success = (await this.windowsMainService.open({
					context: OpenContext.MENU,
					cli: this.environmentMainService.args,
					urisToOpen: [openable],
					forceNewWindow: openInNewWindow,
					gotoLineMode: false,
					remoteAuthority: item.remoteAuthority
				})).length > 0;

				if (!success) {
					await this.workspacesHistoryMainService.removeRecentlyOpened([revivedUri]);
				}
			}
		}, false));
	}

	private isOptionClick(event: KeyboardEvent): boolean {
		return !!(event && ((!isMacintosh && (event.ctrlKey || event.shiftKey)) || (isMacintosh && (event.metaKey || event.altKey))));
	}

	private isKeyboardEvent(event: KeyboardEvent): boolean {
		return !!(event.triggeredByAccelerator || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey);
	}

	private createRoleMenuItem(label: string, commandId: string, role: 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'pasteAndMatchStyle' | 'delete' | 'selectAll' | 'reload' | 'forceReload' | 'toggleDevTools' | 'resetZoom' | 'zoomIn' | 'zoomOut' | 'toggleSpellChecker' | 'togglefullscreen' | 'window' | 'minimize' | 'close' | 'help' | 'about' | 'services' | 'hide' | 'hideOthers' | 'unhide' | 'quit' | 'showSubstitutions' | 'toggleSmartQuotes' | 'toggleSmartDashes' | 'toggleTextReplacement' | 'startSpeaking' | 'stopSpeaking' | 'zoom' | 'front' | 'appMenu' | 'fileMenu' | 'editMenu' | 'viewMenu' | 'shareMenu' | 'recentDocuments' | 'toggleTabBar' | 'selectNextTab' | 'selectPreviousTab' | 'showAllTabs' | 'mergeAllWindows' | 'clearRecentDocuments' | 'moveTabToNewWindow' | 'windowMenu'): MenuItem {
		const options: MenuItemConstructorOptions = {
			label: this.mnemonicLabel(label),
			role,
			enabled: true
		};

		return new MenuItem(this.withKeybinding(commandId, options));
	}

	private setMacWindowMenu(macWindowMenu: Menu): void {
		const minimize = new MenuItem({ label: nls.localize('mMinimize', "Minimize"), role: 'minimize', accelerator: 'Command+M', enabled: this.windowsMainService.getWindowCount() > 0 });
		const zoom = new MenuItem({ label: nls.localize('mZoom', "Zoom"), role: 'zoom', enabled: this.windowsMainService.getWindowCount() > 0 });
		const bringAllToFront = new MenuItem({ label: nls.localize('mBringToFront', "Bring All to Front"), role: 'front', enabled: this.windowsMainService.getWindowCount() > 0 });
		const switchWindow = this.createMenuItem(nls.localize({ key: 'miSwitchWindow', comment: ['&& denotes a mnemonic'] }, "Switch &&Window..."), 'workbench.action.switchWindow');

		const nativeTabMenuItems: MenuItem[] = [];
		if (this.currentEnableNativeTabs) {
			nativeTabMenuItems.push(__separator__());

			nativeTabMenuItems.push(this.createMenuItem(nls.localize('mNewTab', "New Tab"), 'workbench.action.newWindowTab'));

			nativeTabMenuItems.push(this.createRoleMenuItem(nls.localize('mShowPreviousTab', "Show Previous Tab"), 'workbench.action.showPreviousWindowTab', 'selectPreviousTab'));
			nativeTabMenuItems.push(this.createRoleMenuItem(nls.localize('mShowNextTab', "Show Next Tab"), 'workbench.action.showNextWindowTab', 'selectNextTab'));
			nativeTabMenuItems.push(this.createRoleMenuItem(nls.localize('mMoveTabToNewWindow', "Move Tab to New Window"), 'workbench.action.moveWindowTabToNewWindow', 'moveTabToNewWindow'));
			nativeTabMenuItems.push(this.createRoleMenuItem(nls.localize('mMergeAllWindows', "Merge All Windows"), 'workbench.action.mergeAllWindowTabs', 'mergeAllWindows'));
		}

		[
			minimize,
			zoom,
			__separator__(),
			switchWindow,
			...nativeTabMenuItems,
			__separator__(),
			bringAllToFront
		].forEach(item => macWindowMenu.append(item));
	}

	private getUpdateMenuItems(): MenuItem[] {
		const state = this.updateService.state;

		switch (state.type) {
			case StateType.Idle:
				return [new MenuItem({
					label: this.mnemonicLabel(nls.localize('miCheckForUpdates', "Check for &&Updates...")), click: () => setTimeout(() => {
						this.reportMenuActionTelemetry('CheckForUpdate');
						this.updateService.checkForUpdates(true);
					}, 0)
				})];

			case StateType.CheckingForUpdates:
				return [new MenuItem({ label: nls.localize('miCheckingForUpdates', "Checking for Updates..."), enabled: false })];

			case StateType.AvailableForDownload:
				return [new MenuItem({
					label: this.mnemonicLabel(nls.localize('miDownloadUpdate', "D&&ownload Available Update")), click: () => {
						this.updateService.downloadUpdate();
					}
				})];

			case StateType.Downloading:
				return [new MenuItem({ label: nls.localize('miDownloadingUpdate', "Downloading Update..."), enabled: false })];

			case StateType.Downloaded:
				return isMacintosh ? [] : [new MenuItem({
					label: this.mnemonicLabel(nls.localize('miInstallUpdate', "Install &&Update...")), click: () => {
						this.reportMenuActionTelemetry('InstallUpdate');
						this.updateService.applyUpdate();
					}
				})];

			case StateType.Updating:
				return [new MenuItem({ label: nls.localize('miInstallingUpdate', "Installing Update..."), enabled: false })];

			case StateType.Ready:
				return [new MenuItem({
					label: this.mnemonicLabel(nls.localize('miRestartToUpdate', "Restart to &&Update")), click: () => {
						this.reportMenuActionTelemetry('RestartToUpdate');
						this.updateService.quitAndInstall();
					}
				})];

			default:
				return [];
		}
	}

	private createMenuItem(labelOpt: string, commandId: string, enabledOpt?: boolean, checkedOpt?: boolean): MenuItem {
		const label = this.mnemonicLabel(labelOpt);
		const click = (menuItem: MenuItem & IMenuItemWithKeybinding, window: BaseWindow | undefined, event: KeyboardEvent) => {
			const userSettingsLabel = menuItem ? menuItem.userSettingsLabel : null;
			if (userSettingsLabel && event.triggeredByAccelerator) {
				this.runActionInRenderer({ type: 'keybinding', userSettingsLabel });
			} else {
				this.runActionInRenderer({ type: 'commandId', commandId });
			}
		};
		const enabled = typeof enabledOpt === 'boolean' ? enabledOpt : this.windowsMainService.getWindowCount() > 0;
		const checked = typeof checkedOpt === 'boolean' ? checkedOpt : false;

		const options: MenuItemConstructorOptions = {
			label,
			click,
			enabled
		};

		if (checked) {
			options.type = 'checkbox';
			options.checked = checked;
		}

		if (isMacintosh) {

			// Add role for special case menu items
			if (commandId === 'editor.action.clipboardCutAction') {
				options.role = 'cut';
			} else if (commandId === 'editor.action.clipboardCopyAction') {
				options.role = 'copy';
			} else if (commandId === 'editor.action.clipboardPasteAction') {
				options.role = 'paste';
			}

			// Add context aware click handlers for special case menu items
			if (commandId === 'undo') {
				options.click = this.makeContextAwareClickHandler(click, {
					inDevTools: devTools => devTools.undo(),
					inNoWindow: () => Menu.sendActionToFirstResponder('undo:')
				});
			} else if (commandId === 'redo') {
				options.click = this.makeContextAwareClickHandler(click, {
					inDevTools: devTools => devTools.redo(),
					inNoWindow: () => Menu.sendActionToFirstResponder('redo:')
				});
			} else if (commandId === 'editor.action.selectAll') {
				options.click = this.makeContextAwareClickHandler(click, {
					inDevTools: devTools => devTools.selectAll(),
					inNoWindow: () => Menu.sendActionToFirstResponder('selectAll:')
				});
			}
		}

		return new MenuItem(this.withKeybinding(commandId, options));
	}

	private makeContextAwareClickHandler(click: (menuItem: MenuItem, win: BaseWindow, event: KeyboardEvent) => void, contextSpecificHandlers: IMenuItemClickHandler): (menuItem: MenuItem, win: BaseWindow | undefined, event: KeyboardEvent) => void {
		return (menuItem: MenuItem, win: BaseWindow | undefined, event: KeyboardEvent) => {

			// No Active Window
			const activeWindow = BrowserWindow.getFocusedWindow();
			if (!activeWindow) {
				return contextSpecificHandlers.inNoWindow();
			}

			// DevTools focused
			if (activeWindow.webContents.isDevToolsFocused() &&
				activeWindow.webContents.devToolsWebContents) {
				return contextSpecificHandlers.inDevTools(activeWindow.webContents.devToolsWebContents);
			}

			// Finally execute command in Window
			click(menuItem, win || activeWindow, event);
		};
	}

	private runActionInRenderer(invocation: IMenuItemInvocation): boolean {

		// We want to support auxililary windows that may have focus by
		// returning their parent windows as target to support running
		// actions via the main window.
		let activeBrowserWindow = BrowserWindow.getFocusedWindow();
		if (activeBrowserWindow) {
			const auxiliaryWindowCandidate = this.auxiliaryWindowsMainService.getWindowByWebContents(activeBrowserWindow.webContents);
			if (auxiliaryWindowCandidate) {
				activeBrowserWindow = this.windowsMainService.getWindowById(auxiliaryWindowCandidate.parentId)?.win ?? null;
			}
		}

		// We make sure to not run actions when the window has no focus, this helps
		// for https://github.com/microsoft/vscode/issues/25907 and specifically for
		// https://github.com/microsoft/vscode/issues/11928
		// Still allow to run when the last active window is minimized though for
		// https://github.com/microsoft/vscode/issues/63000
		if (!activeBrowserWindow) {
			const lastActiveWindow = this.windowsMainService.getLastActiveWindow();
			if (lastActiveWindow?.win?.isMinimized()) {
				activeBrowserWindow = lastActiveWindow.win;
			}
		}

		const activeWindow = activeBrowserWindow ? this.windowsMainService.getWindowById(activeBrowserWindow.id) : undefined;
		if (activeWindow) {
			this.logService.trace('menubar#runActionInRenderer', invocation);

			if (isMacintosh && !this.environmentMainService.isBuilt && !activeWindow.isReady) {
				if ((invocation.type === 'commandId' && invocation.commandId === 'workbench.action.toggleDevTools') || (invocation.type !== 'commandId' && invocation.userSettingsLabel === 'alt+cmd+i')) {
					// prevent this action from running twice on macOS (https://github.com/microsoft/vscode/issues/62719)
					// we already register a keybinding in workbench.ts for opening developer tools in case something
					// goes wrong and that keybinding is only removed when the application has loaded (= window ready).
					return false;
				}
			}

			if (invocation.type === 'commandId') {
				const runActionPayload: INativeRunActionInWindowRequest = { id: invocation.commandId, from: 'menu' };
				activeWindow.sendWhenReady('vscode:runAction', CancellationToken.None, runActionPayload);
			} else {
				const runKeybindingPayload: INativeRunKeybindingInWindowRequest = { userSettingsLabel: invocation.userSettingsLabel };
				activeWindow.sendWhenReady('vscode:runKeybinding', CancellationToken.None, runKeybindingPayload);
			}

			return true;
		} else {
			this.logService.trace('menubar#runActionInRenderer: no active window found', invocation);

			return false;
		}
	}

	private withKeybinding(commandId: string | undefined, options: MenuItemConstructorOptions & IMenuItemWithKeybinding): MenuItemConstructorOptions {
		const binding = typeof commandId === 'string' ? this.keybindings[commandId] : undefined;

		// Apply binding if there is one
		if (binding?.label) {

			// if the binding is native, we can just apply it
			if (binding.isNative !== false) {
				options.accelerator = binding.label;
				options.userSettingsLabel = binding.userSettingsLabel;
			}

			// the keybinding is not native so we cannot show it as part of the accelerator of
			// the menu item. we fallback to a different strategy so that we always display it
			else if (typeof options.label === 'string') {
				const bindingIndex = options.label.indexOf('[');
				if (bindingIndex >= 0) {
					options.label = `${options.label.substr(0, bindingIndex)} [${binding.label}]`;
				} else {
					options.label = `${options.label} [${binding.label}]`;
				}
			}
		}

		// Unset bindings if there is none
		else {
			options.accelerator = undefined;
		}

		return options;
	}

	private likeAction(commandId: string, options: MenuItemConstructorOptions, setAccelerator = !options.accelerator): MenuItemConstructorOptions {
		if (setAccelerator) {
			options = this.withKeybinding(commandId, options);
		}

		const originalClick = options.click;
		options.click = (item, window, event) => {
			this.reportMenuActionTelemetry(commandId);
			originalClick?.(item, window, event);
		};

		return options;
	}

	private openUrl(url: string, id: string): void {
		this.nativeHostMainService.openExternal(undefined, url);
		this.reportMenuActionTelemetry(id);
	}

	private reportMenuActionTelemetry(id: string): void {
		this.telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id, from: telemetryFrom });
	}

	private mnemonicLabel(label: string): string {
		return mnemonicMenuLabel(label, !this.currentEnableMenuBarMnemonics);
	}
}

function __separator__(): MenuItem {
	return new MenuItem({ type: 'separator' });
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/menubar/electron-main/menubarMainService.ts]---
Location: vscode-main/src/vs/platform/menubar/electron-main/menubarMainService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator, IInstantiationService } from '../../instantiation/common/instantiation.js';
import { ILifecycleMainService, LifecycleMainPhase } from '../../lifecycle/electron-main/lifecycleMainService.js';
import { ILogService } from '../../log/common/log.js';
import { ICommonMenubarService, IMenubarData } from '../common/menubar.js';
import { Menubar } from './menubar.js';
import { Disposable } from '../../../base/common/lifecycle.js';

export const IMenubarMainService = createDecorator<IMenubarMainService>('menubarMainService');

export interface IMenubarMainService extends ICommonMenubarService {
	readonly _serviceBrand: undefined;
}

export class MenubarMainService extends Disposable implements IMenubarMainService {

	declare readonly _serviceBrand: undefined;

	private readonly menubar: Promise<Menubar>;

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ILifecycleMainService private readonly lifecycleMainService: ILifecycleMainService,
		@ILogService private readonly logService: ILogService
	) {
		super();

		this.menubar = this.installMenuBarAfterWindowOpen();
	}

	private async installMenuBarAfterWindowOpen(): Promise<Menubar> {
		await this.lifecycleMainService.when(LifecycleMainPhase.AfterWindowOpen);

		return this._register(this.instantiationService.createInstance(Menubar));
	}

	async updateMenubar(windowId: number, menus: IMenubarData): Promise<void> {
		this.logService.trace('menubarService#updateMenubar', windowId);

		const menubar = await this.menubar;
		menubar.updateMenu(menus, windowId);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/native/common/native.ts]---
Location: vscode-main/src/vs/platform/native/common/native.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../base/common/buffer.js';
import { Event } from '../../../base/common/event.js';
import { URI } from '../../../base/common/uri.js';
import { MessageBoxOptions, MessageBoxReturnValue, OpenDevToolsOptions, OpenDialogOptions, OpenDialogReturnValue, SaveDialogOptions, SaveDialogReturnValue } from '../../../base/parts/sandbox/common/electronTypes.js';
import { ISerializableCommandAction } from '../../action/common/action.js';
import { INativeOpenDialogOptions } from '../../dialogs/common/dialogs.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IV8Profile } from '../../profiling/common/profiling.js';
import { AuthInfo, Credentials } from '../../request/common/request.js';
import { IPartsSplash } from '../../theme/common/themeService.js';
import { IColorScheme, IOpenedAuxiliaryWindow, IOpenedMainWindow, IOpenEmptyWindowOptions, IOpenWindowOptions, IPoint, IRectangle, IWindowOpenable } from '../../window/common/window.js';

export interface ICPUProperties {
	model: string;
	speed: number;
}

export interface IOSProperties {
	type: string;
	release: string;
	arch: string;
	platform: string;
	cpus: ICPUProperties[];
}

export interface IOSStatistics {
	totalmem: number;
	freemem: number;
	loadavg: number[];
}

export interface INativeHostOptions {
	readonly targetWindowId?: number;
}

export const enum FocusMode {

	/**
	 * (Default) Transfer focus to the target window
	 * when the editor is focused.
	 */
	Transfer,

	/**
	 * Transfer focus to the target window when the
	 * editor is focused, otherwise notify the user that
	 * the app has activity (macOS/Windows only).
	 */
	Notify,

	/**
	 * Force the window to be focused, even if the editor
	 * is not currently focused.
	 */
	Force,
}

export interface ICommonNativeHostService {

	readonly _serviceBrand: undefined;

	// Properties
	readonly windowId: number;

	// Events
	readonly onDidOpenMainWindow: Event<number>;

	readonly onDidMaximizeWindow: Event<number>;
	readonly onDidUnmaximizeWindow: Event<number>;

	readonly onDidFocusMainWindow: Event<number>;
	readonly onDidBlurMainWindow: Event<number>;

	readonly onDidChangeWindowFullScreen: Event<{ windowId: number; fullscreen: boolean }>;
	readonly onDidChangeWindowAlwaysOnTop: Event<{ windowId: number; alwaysOnTop: boolean }>;

	readonly onDidFocusMainOrAuxiliaryWindow: Event<number>;
	readonly onDidBlurMainOrAuxiliaryWindow: Event<number>;

	readonly onDidChangeDisplay: Event<void>;

	readonly onDidResumeOS: Event<unknown>;

	readonly onDidChangeColorScheme: Event<IColorScheme>;

	readonly onDidChangePassword: Event<{ readonly service: string; readonly account: string }>;

	readonly onDidTriggerWindowSystemContextMenu: Event<{ readonly windowId: number; readonly x: number; readonly y: number }>;

	// Window
	getWindows(options: { includeAuxiliaryWindows: true }): Promise<Array<IOpenedMainWindow | IOpenedAuxiliaryWindow>>;
	getWindows(options: { includeAuxiliaryWindows: false }): Promise<Array<IOpenedMainWindow>>;
	getWindowCount(): Promise<number>;
	getActiveWindowId(): Promise<number | undefined>;
	getActiveWindowPosition(): Promise<IRectangle | undefined>;
	getNativeWindowHandle(windowId: number): Promise<VSBuffer | undefined>;

	openWindow(options?: IOpenEmptyWindowOptions): Promise<void>;
	openWindow(toOpen: IWindowOpenable[], options?: IOpenWindowOptions): Promise<void>;

	isFullScreen(options?: INativeHostOptions): Promise<boolean>;
	toggleFullScreen(options?: INativeHostOptions): Promise<void>;

	getCursorScreenPoint(): Promise<{ readonly point: IPoint; readonly display: IRectangle }>;

	isMaximized(options?: INativeHostOptions): Promise<boolean>;
	maximizeWindow(options?: INativeHostOptions): Promise<void>;
	unmaximizeWindow(options?: INativeHostOptions): Promise<void>;
	minimizeWindow(options?: INativeHostOptions): Promise<void>;
	moveWindowTop(options?: INativeHostOptions): Promise<void>;
	positionWindow(position: IRectangle, options?: INativeHostOptions): Promise<void>;

	isWindowAlwaysOnTop(options?: INativeHostOptions): Promise<boolean>;
	toggleWindowAlwaysOnTop(options?: INativeHostOptions): Promise<void>;
	setWindowAlwaysOnTop(alwaysOnTop: boolean, options?: INativeHostOptions): Promise<void>;

	/**
	 * Only supported on Windows and macOS. Updates the window controls to match the title bar size.
	 *
	 * @param options `backgroundColor` and `foregroundColor` are only supported on Windows
	 */
	updateWindowControls(options: INativeHostOptions & { height?: number; backgroundColor?: string; foregroundColor?: string }): Promise<void>;

	updateWindowAccentColor(color: 'default' | 'off' | string, inactiveColor: string | undefined): Promise<void>;

	setMinimumSize(width: number | undefined, height: number | undefined): Promise<void>;

	saveWindowSplash(splash: IPartsSplash): Promise<void>;

	setBackgroundThrottling(allowed: boolean): Promise<void>;

	/**
	 * Make the window focused.
	 * @param options specify the specific window to focus and the focus mode.
	 * Defaults to {@link FocusMode.Transfer}.
	 */
	focusWindow(options?: INativeHostOptions & { mode?: FocusMode }): Promise<void>;

	// Dialogs
	showMessageBox(options: MessageBoxOptions & INativeHostOptions): Promise<MessageBoxReturnValue>;
	showSaveDialog(options: SaveDialogOptions & INativeHostOptions): Promise<SaveDialogReturnValue>;
	showOpenDialog(options: OpenDialogOptions & INativeHostOptions): Promise<OpenDialogReturnValue>;

	pickFileFolderAndOpen(options: INativeOpenDialogOptions): Promise<void>;
	pickFileAndOpen(options: INativeOpenDialogOptions): Promise<void>;
	pickFolderAndOpen(options: INativeOpenDialogOptions): Promise<void>;
	pickWorkspaceAndOpen(options: INativeOpenDialogOptions): Promise<void>;

	// OS
	showItemInFolder(path: string): Promise<void>;
	setRepresentedFilename(path: string, options?: INativeHostOptions): Promise<void>;
	setDocumentEdited(edited: boolean, options?: INativeHostOptions): Promise<void>;
	openExternal(url: string, defaultApplication?: string): Promise<boolean>;
	moveItemToTrash(fullPath: string): Promise<void>;

	isAdmin(): Promise<boolean>;
	writeElevated(source: URI, target: URI, options?: { unlock?: boolean }): Promise<void>;
	isRunningUnderARM64Translation(): Promise<boolean>;

	getOSProperties(): Promise<IOSProperties>;
	getOSStatistics(): Promise<IOSStatistics>;
	getOSVirtualMachineHint(): Promise<number>;

	getOSColorScheme(): Promise<IColorScheme>;

	hasWSLFeatureInstalled(): Promise<boolean>;

	// Screenshots
	getScreenshot(rect?: IRectangle): Promise<VSBuffer | undefined>;

	// Process
	getProcessId(): Promise<number | undefined>;
	killProcess(pid: number, code: string): Promise<void>;

	// Clipboard
	triggerPaste(options?: INativeHostOptions): Promise<void>;
	readClipboardText(type?: 'selection' | 'clipboard'): Promise<string>;
	writeClipboardText(text: string, type?: 'selection' | 'clipboard'): Promise<void>;
	readClipboardFindText(): Promise<string>;
	writeClipboardFindText(text: string): Promise<void>;
	writeClipboardBuffer(format: string, buffer: VSBuffer, type?: 'selection' | 'clipboard'): Promise<void>;
	readClipboardBuffer(format: string): Promise<VSBuffer>;
	hasClipboard(format: string, type?: 'selection' | 'clipboard'): Promise<boolean>;
	readImage(): Promise<Uint8Array>;

	// macOS Touchbar
	newWindowTab(): Promise<void>;
	showPreviousWindowTab(): Promise<void>;
	showNextWindowTab(): Promise<void>;
	moveWindowTabToNewWindow(): Promise<void>;
	mergeAllWindowTabs(): Promise<void>;
	toggleWindowTabsBar(): Promise<void>;
	updateTouchBar(items: ISerializableCommandAction[][]): Promise<void>;

	// macOS Shell command
	installShellCommand(): Promise<void>;
	uninstallShellCommand(): Promise<void>;

	// Lifecycle
	notifyReady(): Promise<void>;
	relaunch(options?: { addArgs?: string[]; removeArgs?: string[] }): Promise<void>;
	reload(options?: { disableExtensions?: boolean }): Promise<void>;
	closeWindow(options?: INativeHostOptions): Promise<void>;
	quit(): Promise<void>;
	exit(code: number): Promise<void>;

	// Development
	openDevTools(options?: Partial<OpenDevToolsOptions> & INativeHostOptions): Promise<void>;
	toggleDevTools(options?: INativeHostOptions): Promise<void>;
	openGPUInfoWindow(): Promise<void>;
	openDevToolsWindow(url: string): Promise<void>;
	openContentTracingWindow(): Promise<void>;
	stopTracing(): Promise<void>;

	// Perf Introspection
	profileRenderer(session: string, duration: number): Promise<IV8Profile>;

	// Connectivity
	resolveProxy(url: string): Promise<string | undefined>;
	lookupAuthorization(authInfo: AuthInfo): Promise<Credentials | undefined>;
	lookupKerberosAuthorization(url: string): Promise<string | undefined>;
	loadCertificates(): Promise<string[]>;
	isPortFree(port: number): Promise<boolean>;
	findFreePort(startPort: number, giveUpAfter: number, timeout: number, stride?: number): Promise<number>;

	// Registry (Windows only)
	windowsGetStringRegKey(hive: 'HKEY_CURRENT_USER' | 'HKEY_LOCAL_MACHINE' | 'HKEY_CLASSES_ROOT' | 'HKEY_USERS' | 'HKEY_CURRENT_CONFIG', path: string, name: string): Promise<string | undefined>;
}

export const INativeHostService = createDecorator<INativeHostService>('nativeHostService');

/**
 * A set of methods specific to a native host, i.e. unsupported in web
 * environments.
 *
 * @see {@link IHostService} for methods that can be used in native and web
 * hosts.
 */
export interface INativeHostService extends ICommonNativeHostService { }
```

--------------------------------------------------------------------------------

````
