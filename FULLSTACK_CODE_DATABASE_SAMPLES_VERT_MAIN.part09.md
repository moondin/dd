---
source_txt: fullstack_samples/VERT-main
converted_utc: 2025-12-18T11:26:37Z
part: 9
parts_total: 18
---

# FULLSTACK CODE DATABASE SAMPLES VERT-main

## Verbatim Content (Part 9 of 18)

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

---[FILE: pt-BR.json]---
Location: VERT-main/messages/pt-BR.json
Signals: Docker

```json
{
	"$schema": "https://inlang.com/schema/inlang-message-format",
	"navbar": {
		"upload": "Upload",
		"convert": "Converter",
		"settings": "Ajustes",
		"about": "Sobre",
		"toggle_theme": "Alternar tema"
	},
	"footer": {
		"copyright": "© {year} VERT.",
		"source_code": "Código fonte",
		"discord_server": "Servidor Discord",
		"privacy_policy": "Política de privacidade"
	},
	"upload": {
		"title": "O conversor de arquivos que você vai adorar.",
		"subtitle": "Todo processamento de imagens, audio e documentos é feito no seu dispositivo. Vídeos são convertidos em nossos servidores ultrarrápidos. Sem limite de tamanho de arquivo, sem anúncios e totalmente de código aberto.",
		"uploader": {
			"text": "Arraste ou clique para {action}",
			"convert": "converter"
		},
		"cards": {
			"title": "VERT suporta...",
			"images": "Imagens",
			"audio": "Áudio",
			"documents": "Documentos",
			"video": "Vídeo",
			"video_server_processing": "Suportado pelo servidor",
			"local_supported": "Suportado localmente",
			"status": {
				"text": "<b>Status:</b> {status}",
				"ready": "pronto",
				"not_ready": "não pronto",
				"not_initialized": "não inicializado",
				"downloading": "baixando...",
				"initializing": "inicializando...",
				"unknown": "status desconhecido"
			},
			"supported_formats": "Formatos suportados:"
		},
		"tooltip": {
			"partial_support": "Este formato só pode ser convertido como {direction}.",
			"direction_input": "entrada (de)",
			"direction_output": "saída (para)",
			"video_server_processing": "Uploads de vídeo para um servidor para processamento por padrão, saiba como configurá-lo localmente aqui."
		}
	},
	"convert": {
		"archive_file": {
			"extract": "Extrair arquivo",
			"extracting": "Arquivo detectado: {filename}",
			"extracted": "Extraídos {extract_count} arquivos de {filename}. {ignore_count} itens foram ignorados.",
			"detected": "Arquivos {type} detectados em {filename}.",
			"audio": "áudio",
			"video": "vídeo",
			"doc": "documento",
			"image": "imagem",
			"extract_error": "Erro ao extrair {filename}: {error}"
		},
		"large_file_warning": "Devido a limitações do navegador/dispositivo, a conversão de vídeo para áudio está desativada para este arquivo, pois ele é maior que {limit}GB. Recomendamos usar Firefox ou Safari para arquivos deste tamanho, pois eles têm menos limitações.",
		"external_warning": {
			"title": "Aviso de servidor externo",
			"text": "Se você escolher converter para um formato de vídeo, esses arquivos serão enviados para um servidor externo para conversão. Deseja continuar?",
			"yes": "Sim",
			"no": "Não"
		},
		"panel": {
			"convert_all": "Converter tudo",
			"download_all": "Baixar tudo como .zip",
			"remove_all": "Remover todos os arquivos",
			"set_all_to": "Definir todos para",
			"na": "N/D"
		},
		"dropdown": {
			"audio": "Áudio",
			"video": "ídeo",
			"doc": "Documento",
			"image": "Imagem",
			"placeholder": "Pesquisar formato",
			"no_formats": "Nenhum formato disponível",
			"no_results": "Nenhum formato corresponde à sua pesquisa"
		},
		"tooltips": {
			"unknown_file": "Tipo de arquivo desconhecido",
			"audio_file": "Arquivo de áudio",
			"video_file": "Arquivo de vídeo",
			"document_file": "Arquivo de documento",
			"image_file": "Arquivo de imagem",
			"convert_file": "Converter este arquivo",
			"download_file": "Baixar este arquivo"
		},
		"errors": {
			"cant_convert": "Não podemos converter este arquivo.",
			"vertd_server": "O quê você está fazendo..? você deveria executar o servidor vertd!",
			"vertd_generic_view": "Ver detalhes do erro",
			"vertd_generic_body": "Ocorreu um erro ao tentar converter seu vídeo. Gostaria de enviar este vídeo para os desenvolvedores para ajudar a corrigir este bug? Apenas seu arquivo de vídeo será enviado. Nenhum identificador será carregado.",
			"vertd_generic_title": "Erro de conversão de vídeo",
			"vertd_generic_yes": "Enviar vídeo",
			"vertd_generic_no": "Não enviar",
			"vertd_failed_to_keep": "Falha ao manter o vídeo no servidor: {error}",
			"vertd_details": "Ver detalhes do erro",
			"vertd_details_body": "Se você pressionar enviar, <b>seu vídeo também será anexado</b> junto com o registro de erros que sempre é relatado para nós para revisão. As seguintes informações são o registro que recebemos automaticamente:",
			"vertd_details_footer": "Estas informações serão usadas apenas para fins de solução de problemas e nunca serão compartilhadas. Veja nossa [privacy_link]política de privacidade[/privacy_link] para mais detalhes.",
			"vertd_details_job_id": "<b>ID do trabalho:</b> {jobId}",
			"vertd_details_from": "<b>Formato de origem:</b> {from}",
			"vertd_details_to": "<b>Formato de destino:</b> {to}",
			"vertd_details_error_message": "<b>Mensagem de erro:</b> [view_link]Ver registros de erro[/view_link]",
			"vertd_details_close": "Fechar",
			"vertd_ratelimit": "Seu vídeo, '{filename}', falhou na conversão algumas vezes. Para evitar sobrecarga do servidor, novas tentativas de conversão para este arquivo foram temporariamente bloqueadas. Por favor, tente novamente mais tarde.",
			"unsupported_format": "Apenas arquivos de imagem, vídeo, áudio e documento são suportados",
			"format_output_only": "Este formato atualmente só pode ser usado como saída (convertido para), não como entrada.",
			"vertd_not_found": "Não foi possível encontrar a instância vertd para iniciar a conversão de vídeo. Você tem certeza de que a URL da instância está configurada corretamente?",
			"worker_downloading": "O conversor {type} está sendo inicializado, por favor, aguarde alguns momentos.",
			"worker_error": "O conversor {type} teve um erro durante a inicialização, por favor, tente novamente mais tarde.",
			"worker_timeout": "O conversor {type} está demorando mais do que o esperado para inicializar, por favor, aguarde mais alguns momentos ou atualize a página.",
			"audio": "áudio",
			"doc": "documento",
			"image": "imagem"
		}
	},
	"settings": {
		"title": "Configurações",
		"errors": {
			"save_failed": "Falha ao salvar as configurações!"
		},
		"appearance": {
			"title": "Aparência",
			"brightness_theme": "Tema de exibição",
			"brightness_description": "Quer um visual brilhante e ensolarado, ou uma noite tranquila e solitária?",
			"light": "Claro",
			"dark": "Escuro",
			"effect_settings": "Configurações de efeitos",
			"effect_description": "Você gostaria de efeitos sofisticados ou uma experiência mais estática?",
			"enable": "Ativar",
			"disable": "Desativar"
		},
		"conversion": {
			"title": "Conversão",
			"advanced_settings": "Configurações avançadas",
			"filename_format": "Formato do nome do arquivo",
			"filename_description": "Isso determinará o nome do arquivo no download, <b>não incluindo a extensão do arquivo.</b> Você pode colocar os seguintes modelos no formato, que serão substituídos pelas informações relevantes: <b>%name%</b> para o nome original do arquivo, <b>%extension%</b> para a extensão original do arquivo e <b>%date%</b> para uma string de data de quando o arquivo foi convertido.",
			"placeholder": "VERT_%name%",
			"default_format": "Formato de conversão padrão",
			"default_format_enable": "Habilitar",
			"default_format_disable": "Desabilitar",
			"default_format_description": "Isso mudará o formato padrão selecionado quando você enviar um arquivo deste tipo.",
			"default_format_image": "Imagens",
			"default_format_video": "ídeos",
			"default_format_audio": "Áudio",
			"default_format_document": "Documentos",
			"metadata": "Metadados do arquivo",
			"metadata_description": "Isso altera se algum metadado (EXIF, informações da música, etc.) no arquivo original é preservado nos arquivos convertidos.",
			"keep": "Manter",
			"remove": "Remover",
			"quality": "Qualidade da conversão",
			"quality_description": "Isso altera a qualidade de saída padrão dos arquivos convertidos (em sua categoria). Valores mais altos podem resultar em tempos de conversão mais longos e tamanho de arquivo maior.",
			"quality_video": "Isso altera a qualidade de saída padrão dos arquivos de vídeo convertidos. Valores mais altos podem resultar em tempos de conversão mais longos e tamanho de arquivo maior.",
			"quality_audio": "Áudio (kbps)",
			"quality_images": "Imagem (%)",
			"rate": "Taxa de amostragem (Hz)"
		},
		"vertd": {
			"title": "Conversão de vídeo",
			"status": "status:",
			"loading": "carregando...",
			"available": "disponível, id do commit {commitId}",
			"unavailable": "indisponível (a url está correta?)",
			"description": "O projeto <code>vertd</code> é um wrapper de servidor para FFmpeg. Isso permite que você converta vídeos através da conveniência da interface web do VERT, enquanto ainda pode aproveitar o poder da sua GPU para fazer isso o mais rápido possível.",
			"hosting_info": "Hospedamos uma instância pública para sua conveniência, mas é bastante fácil hospedar a sua própria em seu PC ou servidor se você souber o que está fazendo. Você pode baixar os binários do servidor [vertd_link]aqui[/vertd_link] - o processo de configuração disso ficará mais fácil no futuro, então fique atento!",
			"instance": "Instância",
			"url_placeholder": "Exemplo: http://localhost:24153",
			"conversion_speed": "Velocidade de conversão",
			"speed_description": "Isso descreve a troca entre velocidade e qualidade. Velocidades mais rápidas resultarão em qualidade inferior, mas farão o trabalho mais rapidamente.",
			"speeds": {
				"very_slow": "Muito lento",
				"slower": "Mais lento",
				"slow": "Lento",
				"medium": "Médio",
				"fast": "Rápido",
				"ultra_fast": "Ultra rápido"
			},
			"auto_instance": "Automático (recomendado)",
			"eu_instance": "Falkenstein, Alemanha",
			"us_instance": "Washington, EUA",
			"custom_instance": "Personalizado"
		},
		"privacy": {
			"title": "Privacidade e dados",
			"plausible_title": "Analytics Plausible",
			"plausible_description": "Nós usamos [plausible_link]Plausible[/plausible_link], uma ferramenta de análise focada em privacidade, para coletar estatísticas completamente anônimas. Todos os dados são anonimizados e agregados, e nenhuma informação identificável é enviada ou armazenada. Você pode visualizar as análises [analytics_link]aqui[/analytics_link] e escolher optar por não participar abaixo.",
			"opt_in": "Aceitar",
			"opt_out": "Recusar",
			"cache_title": "Gerenciamento de cache",
			"cache_description": "Armazenamos em cache os arquivos do conversor no seu navegador para que você não precise baixá-los novamente toda vez, melhorando o desempenho e reduzindo o uso de dados.",
			"refresh_cache": "Atualizar cache",
			"clear_cache": "Limpar cache",
			"files_cached": "{size} ({count} arquivos)",
			"loading_cache": "Carregando...",
			"total_size": "Tamanho total",
			"files_cached_label": "Arquivos em cache",
			"cache_cleared": "Cache limpo com sucesso!",
			"cache_clear_error": "Falha ao limpar o cache.",
			"site_data_title": "Gerenciamento de dados do site",
			"site_data_description": "Limpe todos os dados do site, incluindo configurações e arquivos em cache, redefinindo o VERT para seu estado padrão e recarregando a página.",
			"clear_all_data": "Limpar todos os dados do site",
			"clear_all_data_confirm_title": "Limpar todos os dados do site?",
			"clear_all_data_confirm": "Isso irá redefinir todas as configurações e cache, e então recarregar a página. Esta ação não pode ser desfeita.",
			"clear_all_data_cancel": "Cancelar",
			"all_data_cleared": "Todos os dados do site foram limpos! Recarregando a página...",
			"all_data_clear_error": "Falha ao limpar todos os dados do site."
		},
		"language": {
			"title": "Idioma",
			"description": "Selecione seu idioma preferido para a interface do VERT."
		}
	},
	"about": {
		"title": "Sobre",
		"why": {
			"title": "Por que usar o VERT?",
			"description": "<b>Os conversores de arquivos sempre nos decepcionaram.</b> Eles são feios, cheios de anúncios e, o mais importante, lentos. Decidimos resolver esse problema de uma vez por todas, criando uma alternativa que resolve todos esses problemas e mais.<br/><br/>Todos os arquivos que não são de vídeo são convertidos completamente no dispositivo; isso significa que não há atraso entre o envio e o recebimento dos arquivos de um servidor, e nunca bisbilhotamos os arquivos que você converte.<br/><br/>Os arquivos de vídeo são enviados para o nosso servidor RTX 4000 Ada super rápido. Seus vídeos permanecem lá por uma hora se você não os converter. Se você converter o arquivo, o vídeo permanecerá no servidor por uma hora ou até ser baixado. O arquivo será então excluído do nosso servidor."
		},
		"sponsors": {
			"title": "Patrocinadores",
			"description": "Quer nos apoiar? Entre em contato com um desenvolvedor no servidor [discord_link]Discord[/discord_link], ou envie um email para",
			"email_copied": "Email copiado para a área de transferência!"
		},
		"resources": {
			"title": "Recursos",
			"discord": "Discord",
			"source": "Código fonte",
			"email": "Email"
		},
		"donate": {
			"title": "Doar para o VERT",
			"description": "Com seu apoio, podemos continuar mantendo e melhorando o VERT.",
			"one_time": "Única vez",
			"monthly": "Mensal",
			"custom": "Personalizado",
			"pay_now": "Pagar agora",
			"donate_amount": "Doar ${amount} USD",
			"thank_you": "Obrigado pela sua doação!",
			"payment_failed": "Falha no pagamento: {message}{period} Você não foi cobrado.",
			"donation_error": "Ocorreu um erro ao processar sua doação. Por favor, tente novamente mais tarde.",
			"payment_error": "Erro ao buscar detalhes do pagamento. Por favor, tente novamente mais tarde.",
			"donation_notice_official": "Suas doações aqui vão para a instância oficial do VERT (vert.sh) e ajudam a apoiar o desenvolvimento do projeto.",
			"donation_notice_unofficial": "Suas doações aqui vão para o operador desta instância do VERT. Se você deseja apoiar os desenvolvedores oficiais do VERT, por favor visite [official_link]vert.sh[/official_link] em vez disso."
		},
		"credits": {
			"title": "Créditos",
			"contact_team": "Se você gostaria de contatar a equipe de desenvolvimento, por favor use o email encontrado no cartão \"Recursos\".",
			"notable_contributors": "Contribuidores notáveis",
			"notable_description": "Gostaríamos de agradecer a essas pessoas por suas grandes contribuições ao VERT.",
			"github_contributors": "Contribuidores do GitHub",
			"github_description": "Um grande obrigado a todas essas pessoas por ajudarem! [github_link]Quer ajudar também?[/github_link]",
			"no_contributors": "Parece que ninguém contribuiu ainda... [contribute_link]seja o primeiro a contribuir![/contribute_link]",
			"libraries": "Bibliotecas",
			"libraries_description": "Um grande obrigado ao FFmpeg (áudio, vídeo), ImageMagick (imagens) e Pandoc (documentos) por manterem bibliotecas tão excelentes por tantos anos. O VERT depende deles para fornecer suas conversões.",
			"roles": {
				"lead_developer": "Desenvolvedor principal; backend de conversão, implementação da interface do usuário",
				"developer": "Desenvolvedor; implementação da interface do usuário",
				"designer": "Designer; UX, branding, marketing",
				"docker_ci": "Manutenção do Docker e suporte CI",
				"former_cofounder": "Ex-cofundador e designer"
			}
		},
		"errors": {
			"github_contributors": "Erro ao buscar contribuintes do GitHub"
		}
	},
	"workers": {
		"errors": {
			"general": "Erro ao converter {file}: {message}",
			"cancel": "Erro ao cancelar a conversão de {file}: {message}",
			"magick": "Erro no worker Magick, a conversão de imagens pode não funcionar como esperado.",
			"ffmpeg": "Erro ao carregar FFmpeg, alguns recursos podem não funcionar como esperado.",
			"pandoc": "Erro ao carregar o worker Pandoc, a conversão de documentos pode não funcionar como esperado.",
			"no_audio": "Nenhum fluxo de áudio encontrado.",
			"invalid_rate": "Taxa de amostragem especificada inválida: {rate}Hz",
			"file_too_large": "Este arquivo excede o limite de {limit}GB do navegador / dispositivo. Tente Firefox ou Safari para converter este arquivo grande, que normalmente têm limites mais altos."
		}
	},
	"privacy": {
		"title": "Política de Privacidade",
		"summary": {
			"title": "Resumo",
			"description": "A política de privacidade do VERT é muito simples: não coletamos nem armazenamos nenhum dado sobre você. Não usamos cookies ou rastreadores, a análise é completamente privada e todas as conversões (exceto vídeos) acontecem localmente no seu navegador. Os vídeos são excluídos após serem baixados ou após uma hora, a menos que você dê permissão explícita para armazená-los; eles serão usados apenas para fins de solução de problemas. O VERT hospeda uma instância Coolify para hospedar o site e o vertd (para conversão de vídeo), e uma instância Plausible para análises completamente anônimas e agregadas. Usamos Stripe para processar doações, que pode coletar alguns dados usados para prevenção de fraudes.<br/><br/>Observe que isso pode se aplicar apenas à instância oficial do VERT em [vert_link]vert.sh[/vert_link]; instâncias de terceiros podem lidar com seus dados de maneira diferente."
		},
		"conversions": {
			"title": "Conversões",
			"description": "A maioria das conversões (imagens, documentos, áudio) acontece inteiramente localmente no seu dispositivo usando versões WebAssembly das ferramentas relevantes (por exemplo, ImageMagick, Pandoc, FFmpeg). Isso significa que seus arquivos nunca saem do seu dispositivo e nunca teremos acesso a eles.<br/><br/>As conversões de vídeo são realizadas em nossos servidores porque exigem mais poder de processamento e ainda não podem ser feitas muito rapidamente no navegador. Os vídeos que você converte com o VERT são excluídos após serem baixados ou após uma hora, a menos que você dê permissão explícita para armazená-los por mais tempo, apenas para fins de solução de problemas."
		},
		"donations": {
			"title": "Doações",
			"description": "Usamos Stripe na página [about_link]sobre[/about_link] para coletar doações. O Stripe pode coletar certas informações sobre o pagamento e o dispositivo para prevenção de fraudes, conforme descrito na [stripe_link]documentação deles sobre detecção avançada de fraudes[/stripe_link]. As solicitações de rede externas para o Stripe são adiadas e só são feitas depois que você clica no botão para pagar."
		},
		"conversion_errors": {
			"title": "Erros de Conversão",
			"description": "Quando uma conversão de vídeo falha, podemos coletar alguns dados anônimos para nos ajudar a diagnosticar o problema. Esses dados podem incluir:",
			"list_job_id": "O ID do trabalho, que é o nome do arquivo anonimizado",
			"list_format_from": "O formato do qual você converteu",
			"list_format_to": "O formato para o qual você converteu",
			"list_stderr": "A saída stderr do FFmpeg do seu trabalho (mensagem de erro)",
			"list_video": "O arquivo de vídeo real (se for dada permissão explícita)",
			"footer": "Essas informações são usadas exclusivamente para o propósito de diagnosticar problemas de conversão. O arquivo de vídeo real só será coletado se você nos der permissão para isso, onde será usado apenas para solução de problemas."
		},
		"analytics": {
			"title": "Analytics",
			"description": "Hospedamos uma instância Plausible para análises completamente anônimas e agregadas. O Plausible não usa cookies e está em conformidade com todas as principais regulamentações de privacidade (GDPR/CCPA/PECR). Você pode optar por não participar das análises na seção \"Privacidade e dados\" em [settings_link]configurações[/settings_link] e ler mais sobre as práticas de privacidade do Plausible [plausible_link]aqui[/plausible_link]."
		},
		"local_storage": {
			"title": "Armazenamento local",
			"description": "Usamos o armazenamento local do seu navegador para salvar suas configurações, e o armazenamento de sessão do seu navegador para armazenar temporariamente a lista de colaboradores do GitHub para a seção \"Sobre\" para reduzir solicitações repetidas à API do GitHub. Nenhum dado pessoal é armazenado ou transmitido.<br/><br/>As versões WebAssembly das ferramentas de conversão que usamos (FFmpeg, ImageMagick, Pandoc) também são armazenadas localmente no seu navegador quando você visita o site pela primeira vez, para que você não precise baixá-las novamente a cada visita. Nenhum dado pessoal é armazenado ou transmitido. Você pode visualizar ou excluir esses dados a qualquer momento na seção \"Privacidade e dados\" em [settings_link]configurações[/settings_link]."
		},
		"contact": {
			"title": "Contato",
			"description": "Para perguntas, envie um e-mail para: [email_link]hello@vert.sh[/email_link]. Se você estiver usando uma instância de terceiros do VERT, entre em contato com o host dessa instância."
		},
		"last_updated": "Última atualização: 2025-11-27"
	}
}
```

--------------------------------------------------------------------------------

---[FILE: tr.json]---
Location: VERT-main/messages/tr.json
Signals: Docker

```json
{
	"$schema": "https://inlang.com/schema/inlang-message-format",
	"navbar": {
		"upload": "Yükle",
		"convert": "Dönüştür",
		"settings": "Ayarlar",
		"about": "Hakkımızda",
		"toggle_theme": "Temayı değiştir"
	},
	"footer": {
		"copyright": "© {year} VERT.",
		"source_code": "Kaynak kodu",
		"discord_server": "Discord sunucusu"
	},
	"upload": {
		"title": "Sevdiğiniz dosya dönüştürücü.",
		"subtitle": "Tüm görüntü, ses ve belge işlemleri cihazınızda gerçekleştirilir. Videolar, ışık hızındaki sunucularımızda dönüştürülür. Dosya boyutu sınırı ve reklam yoktur. Tamamen açık kaynaklıdır.",
		"uploader": {
			"text": "{action} için sürükleyip bırakın veya dosya seçin",
			"convert": "dönüştürmek"
		},
		"cards": {
			"title": "VERT'in desteklediği formatlar...",
			"images": "Görsel",
			"audio": "Ses",
			"documents": "Belge",
			"video": "Video",
			"video_server_processing": "Sunucuda gerçekleşir",
			"local_supported": "Cihazınızda gerçekleşir",
			"status": {
				"text": "<b>Durum:</b> {status}",
				"ready": "hazır",
				"not_ready": "hazır değil",
				"not_initialized": "başlatılmamış",
				"downloading": "indiriliyor...",
				"initializing": "başlatılıyor...",
				"unknown": "bilinmeyen durum"
			},
			"supported_formats": "Desteklenen formatlar:"
		},
		"tooltip": {
			"partial_support": "Bu format yalnızca şu şekilde dönüştürülebilir: {direction}.",
			"direction_input": "kaynak",
			"direction_output": "çıktı",
			"video_server_processing": "Videolar varsayılan olarak işlenmek üzere sunucuya yüklenir. Yerel olarak nasıl ayarlayacağınızı buradan öğrenebilirsiniz."
		}
	},
	"convert": {
		"external_warning": {
			"title": "Harici sunucu uyarısı",
			"text": "Video formatına dönüştürmeyi seçerseniz, bu dosyalar dönüştürülmek üzere harici bir sunucuya yüklenecektir. Devam etmek istiyor musunuz?",
			"yes": "Evet",
			"no": "Hayır"
		},
		"panel": {
			"convert_all": "Tümünü dönüştür",
			"download_all": "Tümünü .zip olarak indir",
			"remove_all": "Tüm dosyaları kaldır",
			"set_all_to": "Tümünü ayarla",
			"na": "N/A"
		},
		"dropdown": {
			"audio": "Ses",
			"video": "Video",
			"doc": "Belge",
			"image": "Görsel",
			"placeholder": "Format ara"
		},
		"tooltips": {
			"unknown_file": "Bilinmeyen dosya türü",
			"audio_file": "Ses dosyası",
			"video_file": "Video dosyası",
			"document_file": "Belge dosyası",
			"image_file": "Görsel dosyası",
			"convert_file": "Bu dosyayı dönüştür",
			"download_file": "Bu dosyayı indir"
		},
		"errors": {
			"cant_convert": "Bu dosyayı dönüştüremiyoruz.",
			"vertd_server": "Ne yapıyorsun..? vertd sunucusunu çalıştırman gerekiyordu!",
			"unsupported_format": "Yalnızca görüntü, video, ses ve belge dosyaları desteklenir.",
			"vertd_not_found": "Video dönüştürme işlemini başlatmak için vertd örneği bulunamadı. Sunucu URL’sinin doğru ayarlandığından emin misiniz?",
			"worker_downloading": "{type} dönüştürme işlemi şu anda başlatılıyor, lütfen birkaç saniye bekleyin.",
			"worker_error": "{type} dönüştürme işlemi başlatılırken bir hata oluştu, lütfen daha sonra tekrar deneyin.",
			"worker_timeout": "{type} dönüştürme işlemi beklenenden daha uzun sürüyor, lütfen biraz daha bekleyin veya sayfayı yenileyin.",
			"audio": "ses",
			"doc": "belge",
			"image": "görsel"
		}
	},
	"settings": {
		"title": "Ayarlar",
		"errors": {
			"save_failed": "Ayarlar kaydedilirken hata oluştu!"
		},
		"appearance": {
			"title": "Görünüm",
			"brightness_theme": "Tema seçimi",
			"brightness_description": "Güneşli bir gün mü istersiniz, yoksa sessiz ve yalnız bir gece mi?",
			"light": "Açık",
			"dark": "Koyu",
			"effect_settings": "Efekt ayarları",
			"effect_description": "Süslü efektler mi istersiniz, yoksa daha sade bir deneyim mi?",
			"enable": "Etkinleştir",
			"disable": "Devre dışı bırak"
		},
		"conversion": {
			"title": "Dönüştürme",
			"advanced_settings": "Gelişmiş ayarlar",
			"filename_format": "Dosya adı formatı",
			"filename_description": "Bu ayar, <b>dosya uzantısını etkilemeden</b> indirilen dosyanın adını belirleyecektir. Aşağıdaki şablonları formata ekleyebilirsiniz, bunlar ilgili bilgilerle değiştirilecektir: orijinal dosya adı için <b>%name%</b>, orijinal dosya uzantısı için <b>%extension%</b> ve dosyanın dönüştürüldüğü tarihin tarih için <b>%date%</b>.",
			"placeholder": "VERT_%name%",
			"default_format": "Varsayılan dönüştürme formatı",
			"default_format_description": "Bu ayar, bu dosya türünde bir dosya yüklediğinizde seçili olan varsayılan formatı değiştirecektir.",
			"default_format_image": "Görsel",
			"default_format_video": "Video",
			"default_format_audio": "Ses",
			"default_format_document": "Belge",
			"metadata": "Dosya metadata",
			"metadata_description": "Bu ayar, orijinal dosyadaki meta verilerin (EXIF, şarkı bilgileri vb.) dönüştürülen dosyalarda korunup korunmayacağını değiştirir.",
			"keep": "Sakla",
			"remove": "Kaldır",
			"quality": "Dönüştürme kalitesi",
			"quality_description": "Bu, dönüştürülen dosyaların (kendi kategorisinde) varsayılan çıktı kalitesini değiştirir. Yüksek değerler, uzun dönüştürme sürelerine ve büyük dosya boyutuna neden olabilir.",
			"quality_video": "Bu, dönüştürülen videoların varsayılan çıktı kalitesini değiştirir. Yüksek değerler, uzun dönüştürme sürelerine ve büyük dosya boyutuna neden olabilir.",
			"quality_audio": "Ses (kbps)",
			"quality_images": "Görsel (%)",
			"rate": "Örnekleme oranı (Hz)"
		},
		"vertd": {
			"title": "Video dönüştürme",
			"status": "durum:",
			"loading": "yükleniyor...",
			"available": "uygun, işlem no: {commitId}",
			"unavailable": "uygun değil (url doğru mu?)",
			"description": "<code>vertd</code> projesi, FFmpeg için bir sunucu sarmalayıcısıdır (server wrapper). Bu ayar, VERT'in web arayüzünün kullanım kolaylığı ile videoları dönüştürmenize olanak sağlarken, ekran kartınızın gücünden yararlanarak işlemi mümkün olan en hızlı şekilde yapmanızı sağlar.",
			"hosting_info": "Kolaylık sağlaması açısından herkese açık bir dönüştürücü sunuyoruz, ancak kendi bilgisayarınızda veya sunucunuzda kendi dönüştürücünüzü kurmak da oldukça kolaydır. Sunucu binary dosyalarını [vertd_link]buradan[/vertd_link] indirebilirsiniz. Kurulum işlemini gelecekte daha kolay hale getirmeye çalışıyoruz, bu nedenle bizi takip etmeyi unutmayın!",
			"instance": "Sunucu",
			"url_placeholder": "Örneğin: http://localhost:24153",
			"conversion_speed": "Dönüştürme hızı",
			"speed_description": "Bu ayar, hız ve kalite arasındaki dengeyi belirlemenizi sağlar. Yüksek hızlar, düşük kaliteye neden olur ancak işlem daha hızlı tamamlanır.",
			"speeds": {
				"very_slow": "En Yavaş",
				"slower": "Daha Yavaş",
				"slow": "Yavaş",
				"medium": "Orta",
				"fast": "Hızlı",
				"ultra_fast": "En Hızlı"
			},
			"auto_instance": "Otomatik (önerilen)",
			"eu_instance": "Falkenstein, Germany",
			"us_instance": "Washington, USA",
			"custom_instance": "Özel"
		},
		"privacy": {
			"title": "Gizlilik & kişisel veriler",
			"plausible_title": "Plausible analytics",
			"plausible_description": "Tamamen anonim istatistikler toplamak için gizliliğe odaklı bir analiz aracı olan [plausible_link]Plausible[/plausible_link]’ı kullanıyoruz. Tüm veriler anonimleştirilmiş ve birleştirilmiş şekilde işlenir; hiçbir kişisel veya tanımlanabilir bilgi gönderilmez ya da saklanmaz. Analitik verilerini [analytics_link]buradan[/analytics_link] görüntüleyebilir ve aşağıdan devre dışı bırakmayı seçebilirsiniz.",
			"opt_in": "Etkinleştir",
			"opt_out": "Devre dışı bırak",
			"cache_title": "Önbellek yönetimi",
			"cache_description": "Dönüştürücü dosyalarını tarayıcınızda önbelleğe alırız, böylece her seferinde yeniden indirmenize gerek kalmaz, performans artar ve veri kullanımı azalır.",
			"refresh_cache": "Önbelleği Yenile",
			"clear_cache": "Önbelleği Temizle",
			"files_cached": "{size} ({count} dosya)",
			"loading_cache": "Yükleniyor...",
			"total_size": "Toplam Boyut",
			"files_cached_label": "Önbelleğe Alınan Dosyalar",
			"cache_cleared": "Önbellek başarıyla temizlendi."
		},
		"language": {
			"title": "Dil",
			"description": "VERT arayüzü için tercih ettiğiniz dili seçin."
		}
	},
	"about": {
		"title": "Hakkımızda",
		"why": {
			"title": "Neden VERT?",
			"description": "<b>Dosya dönüştürücüler bizi her zaman hayal kırıklığına uğratmıştır. </b> Çoğu dönüştürücü site, kötü ve reklamlarla dolu arayüze sahiptir ve en önemlisi yavaştır. Tüm bu sorunları ve daha fazlasını çözen bir alternatif oluşturarak bu sorunu sonsuza kadar çözmeye karar verdik. <br/><br/>Video dışındaki tüm dosyalar tamamen cihazınızda dönüştürülür; bu, sunucuya dosya yükleme ve sunucudan dosya indirme sırasında gecikme olmaması ve dönüştürdüğünüz dosyaların asla başka biri tarafından görüntülenememesi anlamına gelir. <br/><br/>Video dosyaları, ışık hızındaki RTX 4000 Ada sunucumuza yüklenir. Videolarınızı dönüştürseniz de dönüştürmeseniz de bir saat sonra sunucularımızdan silinir. Video dönüştürme işlemi gerçekleştirirseniz, bir saat içinde dönüştürülmüş dosyayı indirebilirsiniz. Dosya daha sonra sunucumuzdan silinir."
		},
		"sponsors": {
			"title": "Sponsorlar",
			"description": "Bizi desteklemek ister misiniz? [discord_link]Discord[/discord_link] sunucumuzda bir geliştiriciyle iletişime geçin veya şu adrese e-posta gönderin:",
			"email_copied": "E-posta kopyalandı!"
		},
		"resources": {
			"title": "Bağlantılar",
			"discord": "Discord",
			"source": "GitHub",
			"email": "E-posta"
		},
		"donate": {
			"title": "VERT'e bağış yapın",
			"description": "Desteğinizle VERT'i çalıştırmaya ve geliştirmeye devam edebiliriz.",
			"one_time": "Tek seferlik",
			"monthly": "Aylık",
			"custom": "Özel",
			"pay_now": "Ödeme yap",
			"donate_amount": "${amount} USD Bağış Yap",
			"thank_you": "Bağışınız için teşekkür ederiz!",
			"payment_failed": "Ödeme başarısız: {message}{period} Kartınızdan para çekilmedi.",
			"donation_error": "Bağışınız işlenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
			"payment_error": "Ödeme bilgileri alınırken hata oluştu. Lütfen daha sonra tekrar deneyin."
		},
		"credits": {
			"title": "Katkıda bulunanlar",
			"contact_team": "Geliştirme ekibiyle iletişime geçmek isterseniz, \"Bağlantılar\" kısmında bulunan e-posta adresini kullanabilirsiniz.",
			"notable_contributors": "Önemli katılımcılar",
			"notable_description": "VERT'e sağladıkları büyük katkılardan dolayı bu kişilere teşekkür ederiz.",
			"github_contributors": "GitHub katılımcıları",
			"github_description": "Yardımcı olan herkese çok teşekkürler! [github_link]Sen de yardım etmek ister misin?[/github_link]",
			"no_contributors": "Henüz kimse katkıda bulunmamış gibi görünüyor... [contribute_link]ilk katkıda bulunan sen ol![/contribute_link]",
			"libraries": "Kütüphaneler",
			"libraries_description": "Bu mükemmel kütüphaneleri yıllardır geliştirdikleri için FFmpeg (ses, video), ImageMagick (görseller) ve Pandoc (belgeler)'a çok teşekkür ederiz. VERT, dönüştürme işlemleri için bu kütüphaneleri kullanmaktadır.",
			"roles": {
				"lead_developer": "Lead developer; conversion backend, UI implementation",
				"developer": "Developer; UI implementation",
				"designer": "Designer; UX, branding, marketing",
				"docker_ci": "Maintaining Docker & CI support",
				"former_cofounder": "Former co-founder & designer"
			}
		},
		"errors": {
			"github_contributors": "GitHub katılımcılarını yüklerken hata oluştu"
		}
	},
	"workers": {
		"errors": {
			"general": "{file} dönüştürülürken hata oluştu: {message}",
			"cancel": "{file} için dönüştürme işlemi iptal edilirken hata oluştu: {message}",
			"magick": "Magick işlemi sırasında hata oluştu, görsel dönüştürme işlemi beklendiği gibi çalışmayabilir.",
			"ffmpeg": "ffmpeg yüklenirken hata oluştu, bazı özellikler çalışmayabilir.",
			"no_audio": "Ses akışı bulunamadı.",
			"invalid_rate": "Geçersiz örnekleme hızı: {rate}Hz"
		}
	}
}
```

--------------------------------------------------------------------------------

````
