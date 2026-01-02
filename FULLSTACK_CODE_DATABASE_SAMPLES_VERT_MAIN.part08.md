---
source_txt: fullstack_samples/VERT-main
converted_utc: 2025-12-18T11:26:37Z
part: 8
parts_total: 18
---

# FULLSTACK CODE DATABASE SAMPLES VERT-main

## Verbatim Content (Part 8 of 18)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - VERT-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/VERT-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: it.json]---
Location: VERT-main/messages/it.json
Signals: Docker

```json
{
	"$schema": "https://inlang.com/schema/inlang-message-format",
	"navbar": {
		"upload": "Carica",
		"convert": "Converti",
		"settings": "Impostazioni",
		"about": "Informazioni",
		"toggle_theme": "Cambia tema"
	},
	"footer": {
		"copyright": "© {year} VERT.",
		"source_code": "Codice sorgente",
		"discord_server": "Server Discord"
	},
	"upload": {
		"title": "Il convertitore di file che amerai.",
		"subtitle": "Tutta l'elaborazione di immagini, audio e documenti avviene sul tuo dispositivo. I video sono convertiti sui nostri server velocissimi. Nessun limite di dimensione, nessuna pubblicità e completamente open source.",
		"uploader": {
			"text": "Trascina o clicca per {action}",
			"convert": "convertire"
		},
		"cards": {
			"title": "VERT supporta...",
			"images": "Immagini",
			"audio": "Audio",
			"documents": "Documenti",
			"video": "Video",
			"video_server_processing": "Supportato da server",
			"local_supported": "Supportato in locale",
			"status": {
				"text": "<b>Stato:</b> {status}",
				"ready": "pronto",
				"not_ready": "non pronto",
				"not_initialized": "non inizializzato",
				"downloading": "download in corso...",
				"initializing": "inizializzazione in corso...",
				"unknown": "stato sconosciuto"
			},
			"supported_formats": "Formati supportati:"
		},
		"tooltip": {
			"partial_support": "Questo formato può essere convertito solo come {direction}.",
			"direction_input": "input (da)",
			"direction_output": "output (a)",
			"video_server_processing": "Per impostazione predefinita, i video vengono caricati su un server per l'elaborazione. Scopri come configurarlo in locale qui."
		}
	},
	"convert": {
		"external_warning": {
			"title": "Avviso server esterno",
			"text": "Se scegli di convertire in un formato video, quei file verranno caricati su un server esterno per essere convertiti. Vuoi continuare?",
			"yes": "Sì",
			"no": "No"
		},
		"panel": {
			"convert_all": "Converti tutti",
			"download_all": "Scarica tutti come .zip",
			"remove_all": "Rimuovi tutti i file",
			"set_all_to": "Imposta tutti a",
			"na": "N/D"
		},
		"dropdown": {
			"audio": "Audio",
			"video": "Video",
			"doc": "Documento",
			"image": "Immagine",
			"placeholder": "Cerca formato"
		},
		"tooltips": {
			"unknown_file": "Tipo di file sconosciuto",
			"audio_file": "File audio",
			"video_file": "File video",
			"document_file": "File documento",
			"image_file": "File immagine",
			"convert_file": "Converti questo file",
			"download_file": "Scarica questo file"
		},
		"errors": {
			"cant_convert": "Non possiamo convertire questo file.",
			"vertd_server": "cosa stai facendo...? dovresti eseguire il server vertd!",
			"vertd_generic_body": "Si è verificato un errore durante il tentativo di conversione del tuo video. Vuoi inviare questo video agli sviluppatori per aiutare a risolvere questo bug? Verrà inviato solo il tuo file video. Nessun identificatore sarà caricato.",
			"vertd_generic_title": "Errore di conversione video",
			"vertd_generic_yes": "Invia video",
			"vertd_generic_no": "Non inviare",
			"vertd_failed_to_keep": "Impossibile mantenere il video sul server: {error}",
			"unsupported_format": "Sono supportati solo file immagine, video, audio e documento",
			"vertd_not_found": "Impossibile trovare l'istanza vertd per avviare la conversione video. Sei sicuro che l'URL dell'istanza sia impostato correttamente?",
			"worker_downloading": "Il convertitore {type} è attualmente in fase di inizializzazione, attendi qualche istante.",
			"worker_error": "Il convertitore {type} ha avuto un errore durante l'inizializzazione, riprova più tardi.",
			"worker_timeout": "Il convertitore {type} sta impiegando più del previsto per inizializzare, attendi ancora qualche istante o aggiorna la pagina.",
			"audio": "audio",
			"doc": "documento",
			"image": "immagine"
		}
	},
	"settings": {
		"title": "Impostazioni",
		"errors": {
			"save_failed": "Impossibile salvare le impostazioni!"
		},
		"appearance": {
			"title": "Aspetto",
			"brightness_theme": "Tema luminosità",
			"brightness_description": "Vuoi un lampo di sole, o una tranquilla notte solitaria?",
			"light": "Chiaro",
			"dark": "Scuro",
			"effect_settings": "Impostazioni effetti",
			"effect_description": "Desideri effetti *fancy*, o un'esperienza più statica?",
			"enable": "Abilita",
			"disable": "Disabilita"
		},
		"conversion": {
			"title": "Conversione",
			"advanced_settings": "Impostazioni avanzate",
			"filename_format": "Formato nome file",
			"filename_description": "Questo determinerà il nome del file al momento del download, <b>esclusa l'estensione del file.</b> È possibile inserire i seguenti *template* nel formato, che verranno sostituiti con le informazioni pertinenti: <b>%name%</b> per il nome del file originale, <b>%extension%</b> per l'estensione del file originale e <b>%date%</b> per una *stringa* di data di quando il file è stato convertito.",
			"placeholder": "VERT_%name%",
			"default_format": "Formato di conversione predefinito",
			"default_format_description": "Questo cambierà il formato predefinito selezionato quando carichi un file di questo tipo.",
			"default_format_image": "Immagini",
			"default_format_video": "Video",
			"default_format_audio": "Audio",
			"default_format_document": "Documenti",
			"metadata": "Metadati del file",
			"metadata_description": "Questo cambia se eventuali metadati (EXIF, informazioni sul brano, ecc.) del file originale vengono conservati nei file convertiti.",
			"keep": "Mantieni",
			"remove": "Rimuovi",
			"quality": "Qualità di conversione",
			"quality_description": "Questo cambia la qualità di output predefinita dei file convertiti (nella sua categoria). Valori più alti possono comportare tempi di conversione più lunghi e dimensioni maggiori.",
			"quality_video": "Questo cambia la qualità di output predefinita dei file video convertiti. Valori più alti possono comportare tempi di conversione più lunghi e dimensioni maggiori.",
			"quality_audio": "Audio (kbps)",
			"quality_images": "Immagine (%)",
			"rate": "Frequenza di campionamento (Hz)"
		},
		"vertd": {
			"title": "Conversione video",
			"status": "stato:",
			"loading": "caricamento...",
			"available": "disponibile, ID commit {commitId}",
			"unavailable": "non disponibile (l'URL è corretto?)",
			"description": "Il progetto <code>vertd</code> è un *server wrapper* per FFmpeg. Questo ti permette di convertire video attraverso la comodità dell'interfaccia web di VERT, pur essendo in grado di sfruttare la potenza della tua GPU per farlo il più rapidamente possibile.",
			"hosting_info": "Ospitiamo un'istanza pubblica per la tua comodità, ma è abbastanza facile ospitarne una tua sul tuo PC o server se sai cosa stai facendo. Puoi scaricare i binari del server [vertd_link]qui[/vertd_link] - il processo di configurazione diventerà più semplice in futuro, quindi resta sintonizzato!",
			"instance": "Istanza",
			"url_placeholder": "Esempio: http://localhost:24153",
			"conversion_speed": "Velocità di conversione",
			"speed_description": "Questo descrive il compromesso tra velocità e qualità. Velocità maggiori si tradurranno in una qualità inferiore, ma completeranno il lavoro più velocemente.",
			"speeds": {
				"very_slow": "Molto Lento",
				"slower": "Più Lento",
				"slow": "Lento",
				"medium": "Medio",
				"fast": "Veloce",
				"ultra_fast": "Ultra Veloce"
			},
			"auto_instance": "Automatico (consigliato)",
			"eu_instance": "Falkenstein, Germania",
			"us_instance": "Washington, USA",
			"custom_instance": "Personalizzato"
		},
		"privacy": {
			"title": "Privacy e dati",
			"plausible_title": "Statistiche Plausible",
			"plausible_description": "Utilizziamo [plausible_link]Plausible[/plausible_link], uno strumento di analisi focalizzato sulla privacy, per raccogliere statistiche completamente anonime. Tutti i dati sono anonimizzati e aggregati e nessuna informazione identificabile viene mai inviata o archiviata. Puoi visualizzare le statistiche [analytics_link]qui[/analytics_link] e scegliere di disattivare il tracciamento qui sotto.",
			"opt_in": "Attiva tracciamento",
			"opt_out": "Disattiva tracciamento",
			"cache_title": "Gestione della cache",
			"cache_description": "Memorizziamo i file del convertitore nella cache del tuo *browser* in modo che tu non debba riscaricarli ogni volta, migliorando le prestazioni e riducendo l'utilizzo dei dati.",
			"refresh_cache": "Aggiorna cache",
			"clear_cache": "Cancella cache",
			"files_cached": "{size} ({count} file)",
			"loading_cache": "Caricamento...",
			"total_size": "Dimensione Totale",
			"files_cached_label": "File in Cache",
			"cache_cleared": "Cache cancellata con successo!",
			"cache_clear_error": "Impossibile cancellare la cache."
		},
		"language": {
			"title": "Lingua",
			"description": "Seleziona la tua lingua preferita per l'interfaccia di VERT."
		}
	},
	"about": {
		"title": "Informazioni",
		"why": {
			"title": "Perché VERT?",
			"description": "<b>I convertitori di file ci hanno sempre deluso.</b> Sono brutti, pieni di pubblicità e, soprattutto, lenti. Abbiamo deciso di risolvere questo problema una volta per tutte creando un'alternativa che risolve tutti questi problemi e non solo.<br/><br/>Tutti i file non video vengono convertiti completamente sul dispositivo; questo significa che non ci sono ritardi tra l'invio e la ricezione dei file da un server e non possiamo mai spiare i file che converti.<br/><br/>I file video vengono caricati sul nostro velocissimo server RTX 4000 Ada. I tuoi video rimangono lì per un'ora se non li converti. Se converti il file, il video rimarrà sul server per un'ora o fino a quando non viene scaricato. Il file verrà quindi eliminato dal nostro server."
		},
		"sponsors": {
			"title": "Sponsor",
			"description": "Vuoi sostenerci? Contatta uno sviluppatore nel server [discord_link]Discord[/discord_link] o invia un'e-mail a",
			"email_copied": "E-mail copiata negli appunti!"
		},
		"resources": {
			"title": "Risorse",
			"discord": "Discord",
			"source": "Sorgente",
			"email": "E-mail"
		},
		"donate": {
			"title": "Fai una donazione a VERT",
			"description": "Con il tuo supporto, possiamo continuare a mantenere e migliorare VERT.",
			"one_time": "Una tantum",
			"monthly": "Mensile",
			"custom": "Personalizzato",
			"pay_now": "Paga ora",
			"donate_amount": "Dona ${amount} USD",
			"thank_you": "Grazie per la tua donazione!",
			"payment_failed": "Pagamento fallito: {message}{period} Non ti è stato addebitato nulla.",
			"donation_error": "Si è verificato un errore durante l'elaborazione della tua donazione. Riprova più tardi.",
			"payment_error": "Errore nel recupero dei dettagli di pagamento. Riprova più tardi."
		},
		"credits": {
			"title": "Crediti",
			"contact_team": "Se desideri contattare il team di sviluppo, utilizza l'e-mail che trovi sulla scheda \"Risorse\".",
			"notable_contributors": "Contributori di rilievo",
			"notable_description": "Vorremmo ringraziare queste persone per i loro importanti contributi a VERT.",
			"github_contributors": "Contributori GitHub",
			"github_description": "Un grande grazie a tutte queste persone per aver dato una mano! [github_link]Vuoi aiutare anche tu?[/github_link]",
			"no_contributors": "Sembra che nessuno abbia ancora contribuito... [contribute_link]sii il primo a contribuire![/contribute_link]",
			"libraries": "Librerie",
			"libraries_description": "Un grande ringraziamento a FFmpeg (audio, video), ImageMagick (immagini) e Pandoc (documenti) per aver mantenuto librerie così eccellenti per così tanti anni. VERT si affida a loro per fornirti le tue conversioni.",
			"roles": {
				"lead_developer": "Sviluppatore principale; backend di conversione, implementazione UI",
				"developer": "Sviluppatore; implementazione UI",
				"designer": "Designer; UX, branding, marketing",
				"docker_ci": "Manutenzione del supporto Docker e CI",
				"former_cofounder": "Ex co-fondatore e designer"
			}
		},
		"errors": {
			"github_contributors": "Errore nel recupero dei contributori GitHub"
		}
	},
	"workers": {
		"errors": {
			"general": "Errore durante la conversione di {file}: {message}",
			"cancel": "Errore durante l'annullamento della conversione per {file}: {message}",
			"magick": "Errore nel *worker* Magick, la conversione delle immagini potrebbe non funzionare come previsto.",
			"ffmpeg": "Errore durante il caricamento di ffmpeg, alcune funzionalità potrebbero non funzionare.",
			"no_audio": "Nessuno *stream* audio trovato.",
			"invalid_rate": "Frequenza di campionamento specificata non valida: {rate}Hz"
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: ja.json]---
Location: VERT-main/messages/ja.json

```json
{
	"$schema": "https://inlang.com/schema/inlang-message-format",
	"navbar": {
		"upload": "アップロード",
		"convert": "変換",
		"settings": "設定",
		"about": "について",
		"toggle_theme": "テーマを切り替える"
	},
	"footer": {
		"copyright": "© {year} VERT.",
		"source_code": "ソースコード",
		"discord_server": "Discordサーバー"
	},
	"upload": {
		"title": "きっと気に入るファイル変換ツール。",
		"subtitle": "すべての画像・音声・ドキュメント処理はデバイス上で行われます。動画は超高速サーバーで変換されます。ファイルサイズ制限なし、広告なし、完全オープンソース。",
		"uploader": {
			"text": "ドロップまたはクリックして{action}",
			"convert": "変換"
		},
		"cards": {
			"title": "VERTがサポートしている形式",
			"images": "画像",
			"audio": "音声",
			"documents": "ドキュメント",
			"video": "動画",
			"video_server_processing": "サーバー対応",
			"local_supported": "ローカル対応",
			"status": {
				"text": "<b>ステータス:</b> {status}",
				"ready": "準備完了",
				"not_ready": "未準備",
				"not_initialized": "未初期化",
				"downloading": "ダウンロード中...",
				"initializing": "初期化中...",
				"unknown": "不明なステータス"
			},
			"supported_formats": "対応フォーマット:"
		},
		"tooltip": {
			"partial_support": "このフォーマットは{direction}としてのみ変換可能です。",
			"direction_input": "入力（変換元）",
			"direction_output": "出力（変換先）",
			"video_server_processing": "動画はデフォルトでサーバーにアップロードされて処理されます。ローカルで設定する方法はこちら。"
		}
	},
	"convert": {
		"external_warning": {
			"title": "外部サーバーの警告",
			"text": "動画フォーマットへの変換を選択すると、ファイルは外部サーバーにアップロードされて変換されます。続行しますか？",
			"yes": "はい",
			"no": "いいえ"
		},
		"panel": {
			"convert_all": "すべて変換",
			"download_all": "すべてを.zipでダウンロード",
			"remove_all": "すべてのファイルを削除",
			"set_all_to": "すべてを設定",
			"na": "該当なし"
		},
		"dropdown": {
			"audio": "音声",
			"video": "動画",
			"doc": "ドキュメント",
			"image": "画像",
			"placeholder": "フォーマットを検索"
		},
		"tooltips": {
			"unknown_file": "不明なファイルタイプ",
			"audio_file": "音声ファイル",
			"video_file": "動画ファイル",
			"document_file": "ドキュメントファイル",
			"image_file": "画像ファイル",
			"convert_file": "このファイルを変換",
			"download_file": "このファイルをダウンロード"
		},
		"errors": {
			"cant_convert": "このファイルを変換できません。",
			"vertd_server": "何してるの..? vertdサーバーを起動する必要があります！",
			"unsupported_format": "画像、動画、音声、ドキュメントのみ対応しています",
			"vertd_not_found": "動画変換を開始するためのvertdインスタンスが見つかりません。URLが正しいか確認してください。",
			"worker_downloading": "{type}コンバーターを初期化中です。少々お待ちください。",
			"worker_error": "{type}コンバーターの初期化中にエラーが発生しました。後でもう一度お試しください。",
			"worker_timeout": "{type}コンバーターの初期化に予想以上の時間がかかっています。もう少しお待ちいただくか、ページを更新してください。",
			"audio": "音声",
			"doc": "ドキュメント",
			"image": "画像"
		}
	},
	"settings": {
		"title": "設定",
		"errors": {
			"save_failed": "設定の保存に失敗しました！"
		},
		"appearance": {
			"title": "外観",
			"brightness_theme": "明るさテーマ",
			"brightness_description": "まぶしい昼間か、静かな夜か？",
			"light": "ライト",
			"dark": "ダーク",
			"effect_settings": "エフェクト設定",
			"effect_description": "派手な効果にしますか？それとも静的な体験にしますか？",
			"enable": "有効",
			"disable": "無効"
		},
		"conversion": {
			"title": "変換",
			"advanced_settings": "詳細設定",
			"filename_format": "ファイル名フォーマット",
			"filename_description": "これはダウンロード時のファイル名を決定します（拡張子を除く）。以下のテンプレートを使用できます：<b>%name%</b>（元のファイル名）、<b>%extension%</b>（元の拡張子）、<b>%date%</b>（変換日時）。",
			"placeholder": "VERT_%name%",
			"default_format": "デフォルト変換フォーマット",
			"default_format_description": "このファイルタイプをアップロードしたときに自動で選択される形式を変更します。",
			"default_format_image": "画像",
			"default_format_video": "動画",
			"default_format_audio": "音声",
			"default_format_document": "ドキュメント",
			"metadata": "ファイルメタデータ",
			"metadata_description": "変換後のファイルに元のメタデータ（EXIF、曲情報など）を保持するかどうかを変更します。",
			"keep": "保持",
			"remove": "削除",
			"quality": "変換品質",
			"quality_description": "出力ファイルの品質を変更します。値が高いほど処理時間とファイルサイズが増加します。",
			"quality_video": "動画変換の品質を変更します。高品質ほど変換時間とサイズが増加します。",
			"quality_audio": "音声（kbps）",
			"quality_images": "画像（％）",
			"rate": "サンプリングレート（Hz）"
		},
		"vertd": {
			"title": "動画変換",
			"status": "ステータス：",
			"loading": "読み込み中...",
			"available": "利用可能（コミットID {commitId}）",
			"unavailable": "利用不可（URLが正しいですか？）",
			"description": "<code>vertd</code>プロジェクトはFFmpegのサーバーラッパーです。これにより、GPUの性能を活かして高速に変換しつつ、VERTのウェブインターフェイスから簡単に動画を変換できます。",
			"hosting_info": "私たちは利便性のために公開インスタンスをホストしていますが、自分のPCやサーバーでも簡単にホストできます。バイナリは[vertd_link]こちら[/vertd_link]からダウンロードできます。今後さらにセットアップが簡単になる予定です！",
			"instance": "インスタンス",
			"url_placeholder": "例: http://localhost:24153",
			"conversion_speed": "変換速度",
			"speed_description": "速度と品質のバランスを設定します。高速化すると品質が低下しますが、処理は速くなります。",
			"speeds": {
				"very_slow": "非常に遅い",
				"slower": "かなり遅い",
				"slow": "遅い",
				"medium": "普通",
				"fast": "速い",
				"ultra_fast": "超高速"
			},
			"auto_instance": "自動（推奨）",
			"eu_instance": "ドイツ・ファルケンシュタイン",
			"us_instance": "アメリカ・ワシントン",
			"custom_instance": "カスタム"
		},
		"privacy": {
			"title": "プライバシーとデータ",
			"plausible_title": "Plausible解析",
			"plausible_description": "私たちはプライバシー重視の解析ツール[plausible_link]Plausible[/plausible_link]を使用しています。すべてのデータは匿名化・集計され、個人情報は一切収集・保存されません。統計情報は[analytics_link]こちら[/analytics_link]で確認でき、以下でオプトアウト可能です。",
			"opt_in": "参加する",
			"opt_out": "参加しない",
			"cache_title": "キャッシュ管理",
			"cache_description": "コンバーターファイルをブラウザにキャッシュして再ダウンロードを防ぎ、パフォーマンスを向上させます。",
			"refresh_cache": "キャッシュを更新",
			"clear_cache": "キャッシュをクリア",
			"files_cached": "{size}（{count}ファイル）",
			"loading_cache": "読み込み中...",
			"total_size": "合計サイズ",
			"files_cached_label": "キャッシュ済みファイル",
			"cache_cleared": "キャッシュが正常にクリアされました！"
		},
		"language": {
			"title": "言語",
			"description": "VERTインターフェイスの表示言語を選択してください。"
		}
	},
	"about": {
		"title": "について",
		"why": {
			"title": "なぜVERT？",
			"description": "<b>従来のファイルコンバーターにはいつもがっかりしてきました。</b>見た目が悪く、広告だらけで、そして何より遅い。私たちはそれらの問題をすべて解決するためにVERTを作りました。<br/><br/>動画以外のファイルは完全にデバイス上で変換されるため、サーバーとのやり取りによる遅延もなく、あなたのファイルを覗き見ることもありません。<br/><br/>動画は超高速RTX 4000 Adaサーバーで処理され、変換しなかった場合は1時間以内に削除されます。変換された動画も1時間またはダウンロード完了後に削除されます。"
		},
		"sponsors": {
			"title": "スポンサー",
			"description": "私たちを支援したい場合は、[discord_link]Discord[/discord_link]サーバーで開発者に連絡するか、以下のメールアドレスまでご連絡ください。",
			"email_copied": "メールアドレスをコピーしました！"
		},
		"resources": {
			"title": "リソース",
			"discord": "Discord",
			"source": "ソース",
			"email": "メール"
		},
		"donate": {
			"title": "VERTを支援する",
			"description": "あなたの支援でVERTの維持と改善を続けられます。",
			"one_time": "一度きり",
			"monthly": "毎月",
			"custom": "カスタム",
			"pay_now": "今すぐ支払う",
			"donate_amount": "${amount} USDを寄付",
			"thank_you": "ご支援ありがとうございます！",
			"payment_failed": "支払いに失敗しました: {message}{period} 請求は行われていません。",
			"donation_error": "寄付の処理中にエラーが発生しました。後でもう一度お試しください。",
			"payment_error": "支払い情報の取得中にエラーが発生しました。後でもう一度お試しください。"
		},
		"credits": {
			"title": "クレジット",
			"contact_team": "開発チームに連絡したい場合は、「リソース」カードに記載されたメールをご利用ください。",
			"notable_contributors": "特筆すべき貢献者",
			"notable_description": "VERTに大きく貢献してくださった方々に感謝します。",
			"github_contributors": "GitHubの貢献者",
			"github_description": "多くの方々に感謝します！[github_link]あなたも参加してみませんか？[/github_link]",
			"no_contributors": "まだ誰も貢献していないようです… [contribute_link]最初の貢献者になりましょう！[/contribute_link]",
			"libraries": "ライブラリ",
			"libraries_description": "長年にわたり優れたライブラリを提供してくれているFFmpeg（音声・動画）、ImageMagick（画像）、Pandoc（ドキュメント）に感謝します。VERTはこれらに依存して動作しています。",
			"roles": {
				"lead_developer": "リード開発者；変換バックエンド、UI実装",
				"developer": "開発者；UI実装",
				"designer": "デザイナー；UX、ブランディング、マーケティング",
				"docker_ci": "DockerとCIの保守担当",
				"former_cofounder": "元共同創設者・デザイナー"
			}
		},
		"errors": {
			"github_contributors": "GitHub貢献者の取得エラー"
		}
	},
	"workers": {
		"errors": {
			"general": "{file}の変換エラー：{message}",
			"cancel": "{file}の変換キャンセルエラー：{message}",
			"magick": "Magickワーカーでエラーが発生しました。画像変換が正常に動作しない可能性があります。",
			"ffmpeg": "ffmpegの読み込みエラー。一部の機能が動作しない可能性があります。",
			"no_audio": "音声ストリームが見つかりません。",
			"invalid_rate": "無効なサンプリングレートが指定されました: {rate}Hz"
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: ko.json]---
Location: VERT-main/messages/ko.json
Signals: Docker

```json
{
	"$schema": "https://inlang.com/schema/inlang-message-format",
	"navbar": {
		"upload": "업로드",
		"convert": "변환",
		"settings": "설정",
		"about": "정보",
		"toggle_theme": "테마 전환"
	},
	"footer": {
		"copyright": "© {year} VERT.",
		"source_code": "소스 코드",
		"discord_server": "Discord 서버",
		"privacy_policy": "개인정보 처리방침"
	},
	"upload": {
		"title": "이 파일 변환기,\n 마음에 드실 거예요.",
		"subtitle": "모든 이미지, 오디오, 문서 처리는 사용자의 기기에서 이루어집니다. 동영상은 매우 빠른 VERT 전용 서버에서 변환됩니다. 광고나 파일 크기 제한이 전혀 없는 완전한 오픈 소스입니다.",
		"uploader": {
			"text": "드래그하거나 클릭해서 {action}",
			"convert": "변환하기"
		},
		"cards": {
			"title": "VERT가 지원하는 포맷들",
			"images": "이미지",
			"audio": "오디오",
			"documents": "문서",
			"video": "동영상",
			"video_server_processing": "서버 지원",
			"local_supported": "로컬 지원",
			"status": {
				"text": "<b>상태:</b> {status}",
				"ready": "준비됨",
				"not_ready": "준비되지 않음",
				"not_initialized": "준비 안됨",
				"downloading": "다운로드중...",
				"initializing": "준비중...",
				"unknown": "알 수 없음"
			},
			"supported_formats": "지원 포맷:"
		},
		"tooltip": {
			"partial_support": "이 형식은 {direction}으로만 변환할 수 있습니다.",
			"direction_input": "입력 (from)",
			"direction_output": "출력 (to)",
			"video_server_processing": "동영상은 기본적으로 처리를 위해 서버로 업로드됩니다. 로컬로 처리하도록 설정하는 방법은 여기에서 확인하세요."
		}
	},
	"convert": {
		"archive_file": {
			"extracting": "ZIP파일 감지됨: {filename}",
			"extracted": "{filename}압축 파일에서 {extract_count}개의 파일을 풀었습니다. {ignore_count}개 항목은 무시되었습니다.",
			"extract_error": "{filename}압축 파일 풀던 중 오류 발생: {error}"
		},
		"external_warning": {
			"title": "외부 서버 경고",
			"text": "동영상 형식으로 변환을 선택하면 해당 파일은 변환을 위해 지정한 외부 서버로 업로드됩니다. 계속하시겠습니까?",
			"yes": "계속",
			"no": "아니오"
		},
		"panel": {
			"convert_all": "모두 변환",
			"download_all": ".zip으로 다운로드",
			"remove_all": "모든 파일 삭제",
			"set_all_to": "모두 다음으로 설정",
			"na": "N/A"
		},
		"dropdown": {
			"audio": "오디오",
			"video": "비디오",
			"doc": "문서",
			"image": "이미지",
			"placeholder": "포맷 검색"
		},
		"tooltips": {
			"unknown_file": "알 수 없는 파일 포맷",
			"audio_file": "오디오 파일",
			"video_file": "비디오 파일",
			"document_file": "문서 파일",
			"image_file": "이미지 파일",
			"convert_file": "파일 변환하기",
			"download_file": "파일 다운로드"
		},
		"errors": {
			"cant_convert": "이 파일을 변환할 수 없습니다.",
			"vertd_server": "뭐 하는거임? vertd 서버부터 실행하셈",
			"vertd_generic_view": "오류 세부정보 보기",
			"vertd_generic_body": "비디오 변환 중 오류가 발생했습니다. 이 비디오를 개발자에게 전송해서 이 버그를 수정하는 데 도움을 주시겠습니까? 오직 비디오 파일만 전송됩니다. 익명으로 처리되며, 다른 개인 정보는 포함되지 않습니다.",
			"vertd_generic_title": "비디오 변환 오류",
			"vertd_generic_yes": "비디오 전송",
			"vertd_generic_no": "전송 안 함",
			"vertd_failed_to_keep": "영상을 서버에 저장하는데 실패했습니다: {error}",
			"vertd_details": "오류 세부정보 보기",
			"vertd_details_body": "제출을 누르면, 검토를 위해 항상 보고되는 오류 로그와 함께 <b>동영상도 첨부</b>됩니다. 아래 정보는 우리가 자동으로 받는 로그입니다:",
			"vertd_details_footer": "이 정보는 문제 해결 목적으로만 사용되며 절대 공유되지 않습니다. 자세한 내용은 [privacy_link]개인정보 처리방침[/privacy_link]을 확인하세요.",
			"vertd_details_job_id": "<b>작업 ID:</b> {jobId}",
			"vertd_details_from": "<b>원본 포맷:</b> {from}",
			"vertd_details_to": "<b>변환 포맷:</b> {to}",
			"vertd_details_error_message": "<b>오류 메시지:</b> [view_link]오류 로그 보기[/view_link]",
			"vertd_details_close": "닫기",
			"unsupported_format": "이미지, 비디오, 오디오 및 문서 파일만 지원됩니다.",
			"format_output_only": "이 포맷은 현재 입력으로 사용할 수 없으며 (변환된)출력으로만 사용할 수 있습니다.",
			"vertd_not_found": "비디오 변환을 시작할 vertd 인스턴스를 찾을 수 없습니다. 인스턴스 URL이 올바르게 설정되었는지 확인해주세요.",
			"worker_downloading": "현재 {type} 변환기를 준비하고 있습니다. 잠시 기다려 주십시오.",
			"worker_error": "현재 {type} 변환기 준비 중 오류가 발생했습니다. 나중에 다시 시도해 주십시오.",
			"worker_timeout": "{type} 변환기를 준비하는데 예상보다 오래 걸리고 있습니다. 잠시 더 기다리거나 페이지를 새로고침해 주세요.",
			"audio": "오디오",
			"doc": "문서",
			"image": "이미지"
		}
	},
	"settings": {
		"title": "설정",
		"errors": {
			"save_failed": "현재 설정을 저장하는데 실패했습니다"
		},
		"appearance": {
			"title": "테마",
			"brightness_theme": "테마 변경",
			"brightness_description": "걍 알아서",
			"light": "라이트 모드",
			"dark": "다크 모드",
			"effect_settings": "이펙트(효과) 설정",
			"effect_description": "동적인 애니메이션이나 이펙트, 아님 정적인거?",
			"enable": "켜기",
			"disable": "끄기"
		},
		"conversion": {
			"title": "변환",
			"advanced_settings": "고급 설정",
			"filename_format": "파일 이름 형식",
			"filename_description": "다운로드할 파일의 이름을 설정합니다. <b>파일 확장자(포맷)는 포함되지 않습니다.</b> 다음 템플릿을 형식에 넣을 수 있으며, 관련 정보로 대체됩니다: <b>%name%</b> 원본 파일 이름, <b>%extension%</b> 원본 파일 확장자, <b>%date%</b> 파일이 변환된 날짜 문자열.",
			"placeholder": "VERT_%name%",
			"default_format": "기본 변환 형식",
			"default_format_description": "파일 유형의 파일을 업로드할 때 선택되는 기본 형식을 변경합니다.",
			"default_format_image": "이미지",
			"default_format_video": "비디오",
			"default_format_audio": "오디오",
			"default_format_document": "문서",
			"metadata": "파일 메타데이터",
			"metadata_description": "원본 파일의 메타데이터(EXIF, 노래 정보 등)가 변환된 파일에 유지되는지 선택할 수 있습니다.",
			"keep": "유지",
			"remove": "제거",
			"quality": "변환 품질",
			"quality_description": "변환된 파일의 기본 출력 품질을 변경합니다(카테고리 내에서). 더 높은 값은 더 긴 변환 시간과 파일 크기를 초래할 수 있습니다.",
			"quality_video": "변환된 비디오 파일의 기본 출력 품질을 변경합니다. 높은 값은 더 긴시간과 파일 크기를 초래할 수 있습니다.",
			"quality_audio": "오디오 (kbps)",
			"quality_images": "이미지 (%)",
			"rate": "샘플링 주파수 (Hz)"
		},
		"vertd": {
			"title": "비디오 변환 서버",
			"status": "상태:",
			"loading": "로딩중...",
			"available": "사용 가능, 커밋 ID {commitId}",
			"unavailable": "사용 불가 (URL를 다시 확인해주세요.)",
			"description": "<code>vertd</code> 프로젝트는 FFmpeg를 위한 서버 래퍼입니다. 이를 통해 VERT의 웹 인터페이스를 통해 비디오를 변환할 수 있으며, GPU를 활용하여 가능한 한 빠르게 작업을 수행할 수 있습니다.",
			"hosting_info": "편의를 위해 공개 인스턴스를 호스팅하지만, PC나 서버에서 직접 호스팅하는 것도 매우 쉽습니다. 서버 바이너리를 [vertd_link]여기[/vertd_link]에서 다운로드할 수 있습니다. 이 설정 프로세스는 앞으로 더 쉬워질 것이므로 기대해 주세요!",
			"instance": "인스턴스",
			"url_placeholder": "예시: http://localhost:24153",
			"conversion_speed": "변환 속도",
			"speed_description": "이는 속도와 품질 사이의 균형을 설명합니다. 속도를 높일수록 품질은 낮아지지만 작업 속도는 더 빨라집니다.",
			"speeds": {
				"very_slow": "매우 느림",
				"slower": "느림",
				"slow": "조금 느림",
				"medium": "보통",
				"fast": "빠름",
				"ultra_fast": "매우 빠름"
			},
			"auto_instance": "자동 (권장됨)",
			"eu_instance": "Falkenstein, Germany",
			"us_instance": "Washington, USA",
			"custom_instance": "사용자 지정"
		},
		"privacy": {
			"title": "개인정보 및 데이터",
			"plausible_title": "Plausible analytics",
			"plausible_description": "우리는 개인정보 보호에 초점을 둔 분석 도구인 [plausible_link]Plausible[/plausible_link]를 사용해 완전히 익명화된 통계를 수집합니다. 모든 데이터는 익명화되어 집계되며, 식별 가능한 정보는 전송되거나 보관되지 않습니다. 분석 결과는 [analytics_link]여기[/analytics_link]에서 확인할 수 있고, 아래에서 수집을 거부(opt-out)할 수 있습니다",
			"opt_in": "수락",
			"opt_out": "거부",
			"cache_title": "캐시 정리",
			"cache_description": "브라우저에 변환기 파일을 캐시하여 매번 다시 다운로드할 필요가 없도록 하여 최적화와 데이터 사용량을 줄입니다.",
			"refresh_cache": "캐시 새로고침",
			"clear_cache": "캐시 지우기",
			"files_cached": "{size} ({count} files)",
			"loading_cache": "로딩중...",
			"total_size": "총 크기",
			"files_cached_label": "캐시된 파일",
			"cache_cleared": "캐시를 성공적으로 지웠습니다!",
			"cache_clear_error": "캐시를 지우는 중 오류가 발생했습니다"
		},
		"language": {
			"title": "언어",
			"description": "선호하시는 언어를 선택하세요."
		}
	},
	"about": {
		"title": "정보",
		"why": {
			"title": "왜 VERT인가?",
			"description": "<b>파일 변환기들은 항상 저희 기대치에 충족하지 못했습니다.</b> 못생긴 UI에, 광고로 떡칠하고, 그리고 가장 중요한 것은 느리다는겁니다. 그래서 저희가 이 모든 문제를 한 번에 해결할 대안을 직접 만들기로 했습니다. 기존 변환기들의 단점을 해결한 것은 물론이고, 그 이상의 기능도 제공하죠<br/><br/>동영상을 제외한 모든 파일은 사용자의 기기에서 바로 변환됩니다. 즉, 서버로 파일을 보냈다가 다시 받는 시간이 전혀 필요 없고, 저희가 여러분의 파일을 엿볼 일도 전혀 없다는 뜻입니다.<br/><br/>예외적으로 동영상 파일은 초고속 RTX 4000 Ada 서버로 업로드됩니다. 변환하지 않으면 영상은 서버에 1시간 동안 유지됩니다. 변환한 경우에도 영상은 서버에 최대 1시간 또는 다운로드될 때까지 보관되며, 그 후 서버에서 삭제됩니다."
		},
		"sponsors": {
			"title": "후원자",
			"description": "지원하고 싶으신가요? [discord_link]Discord[/discord_link] 서버의 개발자에게 문의하시거나, 다음 이메일로 보내주세요:",
			"email_copied": "클립보드에 이메일 주소가 복사되었습니다!"
		},
		"resources": {
			"title": "Resources",
			"discord": "Discord",
			"source": "소스 코드",
			"email": "이메일"
		},
		"donate": {
			"title": "VERT에 기부하기",
			"description": "여러분의 후원으로 VERT를 지속적으로 유지하고 개발할 수 있습니다.",
			"one_time": "일회성",
			"monthly": "매월",
			"custom": "사용자 지정",
			"pay_now": "지금 결제하기",
			"donate_amount": "${amount} USD 후원하기",
			"thank_you": "후원해주셔서 감사합니다!",
			"payment_failed": "결제 실패: {message}{period} 요금이 청구되지 않았습니다.",
			"donation_error": "결제 처리 중 오류가 발생했습니다. 나중에 다시 시도해 주세요.",
			"payment_error": "결제 세부정보를 가져오는 중 오류가 발생했습니다. 나중에 다시 시도해 주세요."
		},
		"credits": {
			"title": "Credits",
			"contact_team": "개발팀에 연락하시려면 \"Resources\" 카드에 있는 이메일로 연락해 주세요.",
			"notable_contributors": "주요 기여자",
			"notable_description": "VERT에 크게 기여해 주신 분들께 정말 감사드립니다.",
			"github_contributors": "GitHub 기여자",
			"github_description": "도와주신 모든 분들께 진심으로 감사드립니다! [github_link]기여하기[/github_link]",
			"no_contributors": "아직 기여한 사람이 없는 것 같습니다... [contribute_link]첫 번째 기여자가 되어보세요![/contribute_link]",
			"libraries": "라이브러리들",
			"libraries_description": "수년 동안 훌륭한 라이브러리를 유지해 주신 FFmpeg (오디오, 비디오), ImageMagick (이미지) 및 Pandoc (문서)에 진심으로 감사드립니다. VERT는 위 라이브러리들을 사용하여 변환을 제공합니다.",
			"roles": {
				"lead_developer": "총괄 개발자; 변환 백엔드, UI 구현",
				"developer": "개발자; UI 구현",
				"designer": "디자이너; UX, 브랜딩, 마케팅",
				"docker_ci": "Docker 및 CI 지원 유지",
				"former_cofounder": "전 공동 창립자 및 디자이너"
			}
		},
		"errors": {
			"github_contributors": "Error, Github 기여자 불러오기 실패"
		}
	},
	"workers": {
		"errors": {
			"general": "{file}파일을 변환하는데 오류 발생: {message}",
			"cancel": "{file}파일 변환 취소 중 오류 발생: {message}",
			"magick": "Magick 작업에서 오류 발생, 이미지 변환이 예상대로 작동하지 않을 수 있습니다.",
			"ffmpeg": "FFmpeg 로드 중 오류 발생, 일부 기능이 예상대로 작동하지 않을 수 있습니다.",
			"pandoc": "Pandoc 작업 로드 중 오류 발생, 문서 변환이 예상대로 작동하지 않을 수 있습니다.",
			"no_audio": "오디오 스트림을 찾을 수 없습니다.",
			"invalid_rate": "지정된 샘플 레이트가 유효하지 않습니다: {rate}Hz"
		}
	},
	"privacy": {
		"title": "개인정보 처리방침",
		"summary": {
			"title": "요약",
			"description": "VERT의 개인정보 처리방침은 매우 간단합니다: 우리는 귀하에 대한 데이터를 수집하거나 보관하지 않습니다. 우리는 쿠키나 유저를 추적하지 않으며,, 모든 변환(비디오 제외)은 귀하의 브라우저에서 로컬로 수행됩니다. 비디오는 다운로드 후 또는 1시간 후에 삭제되며, 귀하가 명시적으로 보관을 허용한 경우에만 문제 해결을 위해 사용됩니다. VERT는 웹사이트 호스팅을 위한 Coolify 인스턴스와 비디오 변환을 위한 vertd, 완전히 익명화되고 집계된 분석을 위한 Plausible 인스턴스를 자체 호스팅합니다.<br/><br/>이는 [vert_link]vert.sh[/vert_link]의 공식 VERT 인스턴스에만 적용될 수 있습니다. 타사 인스턴스는 귀하의 데이터를 다르게 처리할 수 있습니다."
		},
		"conversions": {
			"title": "변환",
			"description": "대부분의 변환(이미지, 문서, 오디오)은 관련 도구의 WebAssembly 버전(예: ImageMagick, Pandoc, FFmpeg)을 사용하여 여러분의 기기에서 로컬로 수행됩니다. 즉, 파일이 기기를 떠나지 않으며 우리가 파일에 접근할 일은 없습니다.<br/><br/>동영상 변환은 더 높은 연산 성능이 필요하고 아직 브라우저에서 충분히 빠르게 처리하기 어려워 서버에서 수행됩니다. VERT로 변환한 동영상은 다운로드 후 또는 1시간이 지나면 삭제되며, 문제 해결만을 위해 더 오래 보관하도록 명시적으로 허용한 경우에만 예외적으로 보관됩니다."
		},
		"conversion_errors": {
			"title": "변환 오류",
			"description": "비디오 변환이 실패할 경우, 문제 진단을 위해 일부 익명 데이터를 수집할 수 있습니다. 이 데이터에는 다음이 포함될 수 있습니다:",
			"list_job_id": "작업 ID (익명화된 파일 이름)",
			"list_format_from": "변환 전 포맷",
			"list_format_to": "변환 후 포맷",
			"list_stderr": "작업의 FFmpeg stderr 출력 (오류 메시지)",
			"list_video": "실제 비디오 파일 (명시적 권한이 부여된 경우)",
			"footer": "이 정보는 오직 변환 문제를 진단하기 위해서만 사용됩니다. 실제 비디오 파일은 귀하가 수락한 경우에만 수집되며, 그 경우에도 오직 문제 해결을 위해서만 사용됩니다."
		},
		"analytics": {
			"title": "분석",
			"description": "저희는 완전히 익명화되고 집계된 분석을 위해 Plausible을 자체 호스팅합니다. Plausible는 쿠키를 사용하지 않으며 모든 주요 개인정보 보호 규정(GDPR/CCPA/PECR)을 준수합니다. \"개인정보 및 데이터\" 섹션에서 [settings_link]설정[/settings_link]을 통해 분석을 선택 해제할 수 있으며, Plausible의 개인정보 보호 관행에 대한 자세한 내용은 [plausible_link]여기[/plausible_link]에서 확인할 수 있습니다."
		},
		"local_storage": {
			"title": "Local Storage",
			"description": "브라우저의 로컬 스토리지를 사용해 설정을 저장하고, 반복적인 GitHub API 요청을 줄이기 위해 \"정보\" 섹션의 GitHub 기여자 목록을 브라우저의 세션 스토리지에 임시로 저장합니다. 어떤 개인 데이터도 저장되거나 전송되지 않습니다.<br/><br/>사용되는 변환 도구(FFmpeg, ImageMagick, Pandoc)의 WebAssembly 버전도 사용자가 처음 웹사이트를 방문할 때 브라우저에 로컬로 저장되므로, 매번 다시 다운로드할 필요가 없습니다. 어떤 개인 정보나 데이터도 저장되거나 전송되지 않습니다. 이 데이터는 언제든지 [settings_link]설정[/settings_link]의 \"개인정보 및 데이터\" 섹션에서 확인하거나 삭제할 수 있습니다."
		},
		"contact": {
			"title": "문의하기",
			"description": "질문이 있으시면 다음 이메일로 문의해 주세요: [email_link]hello@vert.sh[/email_link]. 서드파티 VERT 인스턴스를 사용 중인 경우 해당 인스턴스의 호스트에게 문의해 주세요."
		},
		"last_updated": "Last updated: 2025-10-19"
	}
}
```

--------------------------------------------------------------------------------

````
