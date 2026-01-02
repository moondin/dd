---
source_txt: fullstack_samples/freqtrade-develop
converted_utc: 2025-12-18T10:36:38Z
part: 1
parts_total: 6
---

# FULLSTACK CODE DATABASE SAMPLES freqtrade-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 1 of 6)

````text
================================================================================
FULLSTACK SAMPLES PATTERN DATABASE - freqtrade-develop
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/freqtrade-develop
================================================================================

NOTES:
- This file intentionally avoids copying large verbatim third-party code.
- It captures reusable patterns, surfaces, and file references.
- Use the referenced file paths to view full implementations locally.

================================================================================

---[FILE: create_command_partials.py]---
Location: freqtrade-develop/build_helpers/create_command_partials.py
Signals: N/A
Excerpt (<=80 chars):  def _write_partial_file(filename: str, content: str):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- _write_partial_file
- extract_command_partials
```

--------------------------------------------------------------------------------

---[FILE: extract_config_json_schema.py]---
Location: freqtrade-develop/build_helpers/extract_config_json_schema.py
Signals: N/A
Excerpt (<=80 chars):  def extract_config_json_schema():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- extract_config_json_schema
```

--------------------------------------------------------------------------------

---[FILE: freqtrade_client_version_align.py]---
Location: freqtrade-develop/build_helpers/freqtrade_client_version_align.py
Signals: N/A
Excerpt (<=80 chars):  def main():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- main
```

--------------------------------------------------------------------------------

---[FILE: pre_commit_update.py]---
Location: freqtrade-develop/build_helpers/pre_commit_update.py
Signals: SQLAlchemy
Excerpt (<=80 chars): import sys

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: exceptions.py]---
Location: freqtrade-develop/freqtrade/exceptions.py
Signals: N/A
Excerpt (<=80 chars): class FreqtradeException(Exception):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FreqtradeException
- OperationalException
- ConfigurationError
- DependencyException
- PricingError
- ExchangeError
- InvalidOrderException
- RetryableOrderError
- InsufficientFundsError
- TemporaryError
- DDosProtection
- StrategyError
```

--------------------------------------------------------------------------------

---[FILE: freqtradebot.py]---
Location: freqtrade-develop/freqtrade/freqtradebot.py
Signals: N/A
Excerpt (<=80 chars):  class FreqtradeBot(LoggingMixin):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FreqtradeBot
- __init__
- update
- log_took_too_long
- notify_status
- cleanup
- startup
- process
- process_stopped
- check_for_open_trades
- _refresh_active_whitelist
- get_free_open_trades
- update_all_liquidation_prices
- update_funding_fees
- startup_backpopulate_precision
- startup_update_open_orders
- update_trades_without_assigned_fees
- handle_insufficient_funds
```

--------------------------------------------------------------------------------

---[FILE: main.py]---
Location: freqtrade-develop/freqtrade/main.py
Signals: N/A
Excerpt (<=80 chars):  def main(sysargv: list[str] | None = None) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- main
```

--------------------------------------------------------------------------------

---[FILE: misc.py]---
Location: freqtrade-develop/freqtrade/misc.py
Signals: N/A
Excerpt (<=80 chars):  def dump_json_to_file(file_obj: TextIO, data: Any) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dump_json_to_file
- file_dump_json
- json_load
- file_load_json
- is_file_in_dir
- pair_to_filename
- deep_merge_dicts
- round_dict
- safe_value_fallback
- safe_value_fallback2
- plural
- chunks
- parse_db_uri_for_logging
- dataframe_to_json
- json_to_dataframe
- remove_entry_exit_signals
- append_candles_to_dataframe
```

--------------------------------------------------------------------------------

---[FILE: wallets.py]---
Location: freqtrade-develop/freqtrade/wallets.py
Signals: N/A
Excerpt (<=80 chars): class Wallet(NamedTuple):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Wallet
- PositionWallet
- Wallets
- __init__
- get_free
- get_used
- get_total
- get_collateral
- get_owned
- _update_dry
- _update_live
- update
- get_all_balances
- get_all_positions
- _check_exit_amount
- check_exit_amount
- get_starting_balance
- get_total_stake_amount
```

--------------------------------------------------------------------------------

---[FILE: worker.py]---
Location: freqtrade-develop/freqtrade/worker.py
Signals: N/A
Excerpt (<=80 chars):  class Worker:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Worker
- __init__
- _init
- _notify
- run
- _worker
- _throttle
- _sleep
- _process_stopped
- _process_running
- _reconfigure
- exit
```

--------------------------------------------------------------------------------

---[FILE: analyze_commands.py]---
Location: freqtrade-develop/freqtrade/commands/analyze_commands.py
Signals: N/A
Excerpt (<=80 chars):  def start_analysis_entries_exits(args: dict[str, Any]) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- start_analysis_entries_exits
```

--------------------------------------------------------------------------------

---[FILE: arguments.py]---
Location: freqtrade-develop/freqtrade/commands/arguments.py
Signals: N/A
Excerpt (<=80 chars):  class Arguments:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Arguments
- __init__
- get_parsed_arg
- _parse_args
- _build_args
- _build_subcommands
```

--------------------------------------------------------------------------------

---[FILE: build_config_commands.py]---
Location: freqtrade-develop/freqtrade/commands/build_config_commands.py
Signals: N/A
Excerpt (<=80 chars):  def start_new_config(args: dict[str, Any]) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- start_new_config
- start_show_config
```

--------------------------------------------------------------------------------

---[FILE: cli_options.py]---
Location: freqtrade-develop/freqtrade/commands/cli_options.py
Signals: N/A
Excerpt (<=80 chars):  def check_int_positive(value: str) -> int:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- check_int_positive
- check_int_nonzero
- Arg
- __init__
```

--------------------------------------------------------------------------------

---[FILE: data_commands.py]---
Location: freqtrade-develop/freqtrade/commands/data_commands.py
Signals: N/A
Excerpt (<=80 chars):  def _check_data_config_download_sanity(config: Config) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- _check_data_config_download_sanity
- start_download_data
- start_convert_trades
- start_convert_data
- start_list_data
- start_list_trades_data
```

--------------------------------------------------------------------------------

---[FILE: db_commands.py]---
Location: freqtrade-develop/freqtrade/commands/db_commands.py
Signals: SQLAlchemy
Excerpt (<=80 chars):  def start_convert_db(args: dict[str, Any]) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- start_convert_db
```

--------------------------------------------------------------------------------

---[FILE: deploy_commands.py]---
Location: freqtrade-develop/freqtrade/commands/deploy_commands.py
Signals: N/A
Excerpt (<=80 chars):  def start_create_userdir(args: dict[str, Any]) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- start_create_userdir
- deploy_new_strategy
- start_new_strategy
- start_install_ui
```

--------------------------------------------------------------------------------

---[FILE: deploy_ui.py]---
Location: freqtrade-develop/freqtrade/commands/deploy_ui.py
Signals: N/A
Excerpt (<=80 chars):  def clean_ui_subdir(directory: Path):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- clean_ui_subdir
- read_ui_version
- download_and_install_ui
- get_ui_download_url
```

--------------------------------------------------------------------------------

---[FILE: hyperopt_commands.py]---
Location: freqtrade-develop/freqtrade/commands/hyperopt_commands.py
Signals: N/A
Excerpt (<=80 chars):  def start_hyperopt_list(args: dict[str, Any]) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- start_hyperopt_list
- start_hyperopt_show
```

--------------------------------------------------------------------------------

---[FILE: list_commands.py]---
Location: freqtrade-develop/freqtrade/commands/list_commands.py
Signals: N/A
Excerpt (<=80 chars):  def start_list_exchanges(args: dict[str, Any]) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- start_list_exchanges
- _print_objs_tabular
- start_list_strategies
- start_list_freqAI_models
- start_list_hyperopt_loss_functions
- start_list_timeframes
- start_list_markets
- start_show_trades
```

--------------------------------------------------------------------------------

---[FILE: optimize_commands.py]---
Location: freqtrade-develop/freqtrade/commands/optimize_commands.py
Signals: N/A
Excerpt (<=80 chars):  def setup_optimize_configuration(args: dict[str, Any], method: RunMode) -> d...

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- setup_optimize_configuration
- start_backtesting
- start_backtesting_show
- start_hyperopt
- start_edge
- start_lookahead_analysis
- start_recursive_analysis
```

--------------------------------------------------------------------------------

---[FILE: pairlist_commands.py]---
Location: freqtrade-develop/freqtrade/commands/pairlist_commands.py
Signals: N/A
Excerpt (<=80 chars):  def start_test_pairlist(args: dict[str, Any]) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- start_test_pairlist
```

--------------------------------------------------------------------------------

---[FILE: plot_commands.py]---
Location: freqtrade-develop/freqtrade/commands/plot_commands.py
Signals: N/A
Excerpt (<=80 chars):  def validate_plot_args(args: dict[str, Any]) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validate_plot_args
- start_plot_dataframe
- start_plot_profit
```

--------------------------------------------------------------------------------

---[FILE: strategy_utils_commands.py]---
Location: freqtrade-develop/freqtrade/commands/strategy_utils_commands.py
Signals: N/A
Excerpt (<=80 chars):  def start_strategy_update(args: dict[str, Any]) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- start_strategy_update
- start_conversion
```

--------------------------------------------------------------------------------

---[FILE: trade_commands.py]---
Location: freqtrade-develop/freqtrade/commands/trade_commands.py
Signals: N/A
Excerpt (<=80 chars):  def start_trading(args: dict[str, Any]) -> int:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- start_trading
- term_handler
```

--------------------------------------------------------------------------------

---[FILE: webserver_commands.py]---
Location: freqtrade-develop/freqtrade/commands/webserver_commands.py
Signals: N/A
Excerpt (<=80 chars):  def start_webserver(args: dict[str, Any]) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- start_webserver
```

--------------------------------------------------------------------------------

---[FILE: configuration.py]---
Location: freqtrade-develop/freqtrade/configuration/configuration.py
Signals: N/A
Excerpt (<=80 chars):  class Configuration:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Configuration
- __init__
- get_config
- from_files
- load_config
- _process_logging_options
- _process_trading_options
- _process_common_options
- _process_datadir_options
- _process_optimize_options
- _process_plot_options
- _process_data_options
- _process_analyze_options
- _args_to_config_loop
- _process_runmode
- _process_freqai_options
- _args_to_config
- _resolve_pairs_list
```

--------------------------------------------------------------------------------

---[FILE: config_secrets.py]---
Location: freqtrade-develop/freqtrade/configuration/config_secrets.py
Signals: N/A
Excerpt (<=80 chars):  def sanitize_config(config: Config, *, show_sensitive: bool = False) -> Config:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sanitize_config
- remove_exchange_credentials
```

--------------------------------------------------------------------------------

---[FILE: config_setup.py]---
Location: freqtrade-develop/freqtrade/configuration/config_setup.py
Signals: N/A
Excerpt (<=80 chars):  def setup_utils_configuration(

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- setup_utils_configuration
```

--------------------------------------------------------------------------------

---[FILE: config_validation.py]---
Location: freqtrade-develop/freqtrade/configuration/config_validation.py
Signals: N/A
Excerpt (<=80 chars):  def _extend_validator(validator_class):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- _extend_validator
- set_defaults
- validate_config_schema
- validate_config_consistency
- _validate_unlimited_amount
- _validate_price_config
- _validate_trailing_stoploss
- _validate_edge
- _validate_whitelist
- _validate_ask_orderbook
- validate_migrated_strategy_settings
- _validate_time_in_force
- _validate_order_types
- _validate_unfilledtimeout
- _validate_pricing_rules
- _validate_freqai_hyperopt
- _validate_freqai_include_timeframes
- _validate_freqai_backtest
```

--------------------------------------------------------------------------------

---[FILE: deploy_config.py]---
Location: freqtrade-develop/freqtrade/configuration/deploy_config.py
Signals: N/A
Excerpt (<=80 chars):  def validate_is_int(val):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validate_is_int
- validate_is_float
- ask_user_overwrite
- ask_user_config
- deploy_new_config
```

--------------------------------------------------------------------------------

---[FILE: deprecated_settings.py]---
Location: freqtrade-develop/freqtrade/configuration/deprecated_settings.py
Signals: N/A
Excerpt (<=80 chars):  def check_conflicting_settings(

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- check_conflicting_settings
- process_removed_setting
- process_deprecated_setting
- process_temporary_deprecated_settings
```

--------------------------------------------------------------------------------

---[FILE: detect_environment.py]---
Location: freqtrade-develop/freqtrade/configuration/detect_environment.py
Signals: N/A
Excerpt (<=80 chars):  def running_in_docker() -> bool:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- running_in_docker
```

--------------------------------------------------------------------------------

---[FILE: directory_operations.py]---
Location: freqtrade-develop/freqtrade/configuration/directory_operations.py
Signals: N/A
Excerpt (<=80 chars):  def create_datadir(config: Config, datadir: str | None = None) -> Path:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- create_datadir
- chown_user_directory
- create_userdata_dir
- copy_sample_files
```

--------------------------------------------------------------------------------

---[FILE: environment_vars.py]---
Location: freqtrade-develop/freqtrade/configuration/environment_vars.py
Signals: N/A
Excerpt (<=80 chars):  def _get_var_typed(val):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- _get_var_typed
- _flat_vars_to_nested_dict
- environment_vars_to_dict
```

--------------------------------------------------------------------------------

---[FILE: load_config.py]---
Location: freqtrade-develop/freqtrade/configuration/load_config.py
Signals: N/A
Excerpt (<=80 chars):  def log_config_error_range(path: str, errmsg: str) -> str:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- log_config_error_range
- load_file
- load_config_file
- load_from_files
```

--------------------------------------------------------------------------------

---[FILE: timerange.py]---
Location: freqtrade-develop/freqtrade/configuration/timerange.py
Signals: N/A
Excerpt (<=80 chars):  class TimeRange:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TimeRange
- __init__
- startdt
- stopdt
- timerange_str
- start_fmt
- stop_fmt
- __repr__
- __eq__
- subtract_start
- adjust_start_if_necessary
- parse_timerange
```

--------------------------------------------------------------------------------

---[FILE: dataprovider.py]---
Location: freqtrade-develop/freqtrade/data/dataprovider.py
Signals: N/A
Excerpt (<=80 chars):  class DataProvider:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DataProvider
- __init__
- _set_dataframe_max_index
- _set_dataframe_max_date
- _set_cached_df
- _set_producer_pairs
- get_producer_pairs
- _emit_df
- _replace_external_df
- _add_external_df
- get_producer_df
- add_pairlisthandler
- historic_ohlcv
- get_required_startup
- __fix_funding_rate_timeframe
- get_pair_dataframe
- get_analyzed_dataframe
- runmode
```

--------------------------------------------------------------------------------

---[FILE: entryexitanalysis.py]---
Location: freqtrade-develop/freqtrade/data/entryexitanalysis.py
Signals: N/A
Excerpt (<=80 chars):  def _process_candles_and_indicators(

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- _process_candles_and_indicators
- _analyze_candles_and_indicators
- _do_group_table_output
- _do_rejected_signals_output
- _select_rows_within_dates
- _select_rows_by_tags
- prepare_results
- print_results
- _merge_dfs
- _print_table
- process_entry_exit_reasons
- _generate_dfs
```

--------------------------------------------------------------------------------

---[FILE: metrics.py]---
Location: freqtrade-develop/freqtrade/data/metrics.py
Signals: N/A
Excerpt (<=80 chars):  def calculate_market_change(

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- calculate_market_change
- combine_dataframes_by_column
- combined_dataframes_with_rel_mean
- combine_dataframes_with_mean
- create_cum_profit
- _calc_drawdown_series
- calculate_underwater
- DrawDownResult
- calculate_max_drawdown
- calculate_csum
- calculate_cagr
- calculate_expectancy
- calculate_sortino
- calculate_sharpe
- calculate_calmar
- calculate_sqn
```

--------------------------------------------------------------------------------

---[FILE: bt_fileutils.py]---
Location: freqtrade-develop/freqtrade/data/btanalysis/bt_fileutils.py
Signals: SQLAlchemy
Excerpt (<=80 chars):  def get_latest_optimize_filename(directory: Path | str, variant: str) -> str:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- get_latest_optimize_filename
- get_latest_backtest_filename
- get_latest_hyperopt_filename
- get_latest_hyperopt_file
- load_backtest_metadata
- _normalize_filename
- load_backtest_stats
- load_and_merge_backtest_result
- _get_backtest_files
- _extract_backtest_result
- get_backtest_result
- get_backtest_resultlist
- delete_backtest_result
- update_backtest_metadata
- get_backtest_market_change
- find_existing_backtest_stats
- _load_backtest_data_df_compatibility
- load_backtest_data
```

--------------------------------------------------------------------------------

---[FILE: historic_precision.py]---
Location: freqtrade-develop/freqtrade/data/btanalysis/historic_precision.py
Signals: N/A
Excerpt (<=80 chars):  def get_tick_size_over_time(candles: DataFrame) -> Series:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- get_tick_size_over_time
```

--------------------------------------------------------------------------------

---[FILE: trade_parallelism.py]---
Location: freqtrade-develop/freqtrade/data/btanalysis/trade_parallelism.py
Signals: N/A
Excerpt (<=80 chars):  def analyze_trade_parallelism(trades: pd.DataFrame, timeframe: str) -> pd.Da...

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- analyze_trade_parallelism
- evaluate_result_multi
```

--------------------------------------------------------------------------------

---[FILE: converter.py]---
Location: freqtrade-develop/freqtrade/data/converter/converter.py
Signals: N/A
Excerpt (<=80 chars):  def ohlcv_to_dataframe(

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ohlcv_to_dataframe
- clean_ohlcv_dataframe
- ohlcv_fill_up_missing_data
- trim_dataframe
- trim_dataframes
- order_book_to_dataframe
- convert_ohlcv_format
- reduce_dataframe_footprint
```

--------------------------------------------------------------------------------

---[FILE: orderflow.py]---
Location: freqtrade-develop/freqtrade/data/converter/orderflow.py
Signals: N/A
Excerpt (<=80 chars):  def _init_dataframe_with_trades_columns(dataframe: pd.DataFrame):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- _init_dataframe_with_trades_columns
- timeframe_to_DateOffset
- _calculate_ohlcv_candle_start_and_end
- populate_dataframe_with_trades
- trades_to_volumeprofile_with_total_delta_bid_ask
- trades_orderflow_to_imbalances
- stacked_imbalance
```

--------------------------------------------------------------------------------

---[FILE: trade_converter.py]---
Location: freqtrade-develop/freqtrade/data/converter/trade_converter.py
Signals: N/A
Excerpt (<=80 chars):  def trades_df_remove_duplicates(trades: pd.DataFrame) -> pd.DataFrame:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- trades_df_remove_duplicates
- trades_dict_to_list
- trades_convert_types
- trades_list_to_df
- trades_to_ohlcv
- convert_trades_to_ohlcv
- convert_trades_format
```

--------------------------------------------------------------------------------

---[FILE: trade_converter_kraken.py]---
Location: freqtrade-develop/freqtrade/data/converter/trade_converter_kraken.py
Signals: N/A
Excerpt (<=80 chars):  def import_kraken_trades_from_csv(config: Config, convert_to: str):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- import_kraken_trades_from_csv
```

--------------------------------------------------------------------------------

---[FILE: history_utils.py]---
Location: freqtrade-develop/freqtrade/data/history/history_utils.py
Signals: N/A
Excerpt (<=80 chars):  def load_pair_history(

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- load_pair_history
- load_data
- refresh_data
- _load_cached_data_for_updating
- _download_pair_history
- refresh_backtest_ohlcv_data
- _download_all_pairs_history_parallel
- _download_trades_history
- refresh_backtest_trades_data
- get_timerange
- validate_backtest_data
- download_data_main
- download_data
```

--------------------------------------------------------------------------------

---[FILE: featherdatahandler.py]---
Location: freqtrade-develop/freqtrade/data/history/datahandlers/featherdatahandler.py
Signals: N/A
Excerpt (<=80 chars):  class FeatherDataHandler(IDataHandler):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FeatherDataHandler
- ohlcv_store
- _ohlcv_load
- ohlcv_append
- _trades_store
- trades_append
- _build_arrow_time_filter
- _trades_load
- _get_file_extension
```

--------------------------------------------------------------------------------

---[FILE: idatahandler.py]---
Location: freqtrade-develop/freqtrade/data/history/datahandlers/idatahandler.py
Signals: N/A
Excerpt (<=80 chars):  class IDataHandler(ABC):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IDataHandler
- __init__
- _get_file_extension
- ohlcv_get_available_data
- ohlcv_get_pairs
- ohlcv_store
- ohlcv_data_min_max
- _ohlcv_load
- ohlcv_purge
- ohlcv_append
- trades_get_available_data
- trades_data_min_max
- trades_get_pairs
- _trades_store
- trades_append
- _trades_load
- trades_store
- trades_purge
```

--------------------------------------------------------------------------------

---[FILE: jsondatahandler.py]---
Location: freqtrade-develop/freqtrade/data/history/datahandlers/jsondatahandler.py
Signals: N/A
Excerpt (<=80 chars):  class JsonDataHandler(IDataHandler):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JsonDataHandler
- ohlcv_store
- _ohlcv_load
- ohlcv_append
- _trades_store
- trades_append
- _trades_load
- _get_file_extension
- JsonGzDataHandler
```

--------------------------------------------------------------------------------

---[FILE: parquetdatahandler.py]---
Location: freqtrade-develop/freqtrade/data/history/datahandlers/parquetdatahandler.py
Signals: N/A
Excerpt (<=80 chars):  class ParquetDataHandler(IDataHandler):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ParquetDataHandler
- ohlcv_store
- _ohlcv_load
- ohlcv_append
- _trades_store
- trades_append
- _trades_load
- _get_file_extension
```

--------------------------------------------------------------------------------

---[FILE: backteststate.py]---
Location: freqtrade-develop/freqtrade/enums/backteststate.py
Signals: N/A
Excerpt (<=80 chars):  class BacktestState(Enum):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BacktestState
- __str__
```

--------------------------------------------------------------------------------

---[FILE: candletype.py]---
Location: freqtrade-develop/freqtrade/enums/candletype.py
Signals: N/A
Excerpt (<=80 chars):  class CandleType(str, Enum):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CandleType
- __str__
- from_string
- get_default
```

--------------------------------------------------------------------------------

---[FILE: exitchecktuple.py]---
Location: freqtrade-develop/freqtrade/enums/exitchecktuple.py
Signals: N/A
Excerpt (<=80 chars):  class ExitCheckTuple:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExitCheckTuple
- __init__
- exit_flag
- __eq__
- __repr__
```

--------------------------------------------------------------------------------

---[FILE: exittype.py]---
Location: freqtrade-develop/freqtrade/enums/exittype.py
Signals: N/A
Excerpt (<=80 chars):  class ExitType(Enum):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExitType
- __str__
```

--------------------------------------------------------------------------------

---[FILE: hyperoptstate.py]---
Location: freqtrade-develop/freqtrade/enums/hyperoptstate.py
Signals: N/A
Excerpt (<=80 chars):  class HyperoptState(Enum):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HyperoptState
- __str__
```

--------------------------------------------------------------------------------

---[FILE: marginmode.py]---
Location: freqtrade-develop/freqtrade/enums/marginmode.py
Signals: N/A
Excerpt (<=80 chars):  class MarginMode(str, Enum):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MarginMode
- __str__
```

--------------------------------------------------------------------------------

---[FILE: marketstatetype.py]---
Location: freqtrade-develop/freqtrade/enums/marketstatetype.py
Signals: N/A
Excerpt (<=80 chars):  class MarketDirection(Enum):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MarketDirection
- __str__
```

--------------------------------------------------------------------------------

---[FILE: ordertypevalue.py]---
Location: freqtrade-develop/freqtrade/enums/ordertypevalue.py
Signals: N/A
Excerpt (<=80 chars):  class OrderTypeValues(str, Enum):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrderTypeValues
```

--------------------------------------------------------------------------------

---[FILE: pricetype.py]---
Location: freqtrade-develop/freqtrade/enums/pricetype.py
Signals: N/A
Excerpt (<=80 chars):  class PriceType(str, Enum):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PriceType
```

--------------------------------------------------------------------------------

---[FILE: rpcmessagetype.py]---
Location: freqtrade-develop/freqtrade/enums/rpcmessagetype.py
Signals: N/A
Excerpt (<=80 chars):  class RPCMessageType(str, Enum):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RPCMessageType
- __repr__
- __str__
- RPCRequestType
```

--------------------------------------------------------------------------------

---[FILE: runmode.py]---
Location: freqtrade-develop/freqtrade/enums/runmode.py
Signals: N/A
Excerpt (<=80 chars):  class RunMode(str, Enum):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RunMode
```

--------------------------------------------------------------------------------

---[FILE: signaltype.py]---
Location: freqtrade-develop/freqtrade/enums/signaltype.py
Signals: N/A
Excerpt (<=80 chars):  class SignalType(Enum):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SignalType
- __str__
- SignalTagType
- SignalDirection
```

--------------------------------------------------------------------------------

---[FILE: state.py]---
Location: freqtrade-develop/freqtrade/enums/state.py
Signals: N/A
Excerpt (<=80 chars):  class State(Enum):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- State
- __str__
```

--------------------------------------------------------------------------------

---[FILE: tradingmode.py]---
Location: freqtrade-develop/freqtrade/enums/tradingmode.py
Signals: N/A
Excerpt (<=80 chars):  class TradingMode(str, Enum):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TradingMode
- __str__
```

--------------------------------------------------------------------------------

---[FILE: binance.py]---
Location: freqtrade-develop/freqtrade/exchange/binance.py
Signals: N/A
Excerpt (<=80 chars):  class Binance(Exchange):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Binance
- __init__
- get_proxy_coin
- get_tickers
- additional_exchange_init
- fetch_stoploss_order
- cancel_stoploss_order
- get_historic_ohlcv
- get_historic_ohlcv_fast
- funding_fee_cutoff
- fetch_funding_rates
- dry_run_liquidation_price
- load_leverage_tiers
- _check_delisting_futures
- check_delisting_time
- _get_spot_delist_schedule
- _get_spot_pair_delist_time
- Binanceusdm
```

--------------------------------------------------------------------------------

---[FILE: binance_public_data.py]---
Location: freqtrade-develop/freqtrade/exchange/binance_public_data.py
Signals: N/A
Excerpt (<=80 chars):  class Http404(Exception):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Http404
- __init__
- BadHttpStatus
- concat_safe
- date_range
- binance_vision_zip_name
- candle_type_to_url_segment
- binance_vision_ohlcv_zip_url
- binance_vision_trades_zip_url
- parse_trades_from_zip
```

--------------------------------------------------------------------------------

---[FILE: bingx.py]---
Location: freqtrade-develop/freqtrade/exchange/bingx.py
Signals: N/A
Excerpt (<=80 chars):  class Bingx(Exchange):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Bingx
```

--------------------------------------------------------------------------------

---[FILE: bitget.py]---
Location: freqtrade-develop/freqtrade/exchange/bitget.py
Signals: N/A
Excerpt (<=80 chars):  class Bitget(Exchange):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Bitget
- ohlcv_candle_limit
- _convert_stop_order
- _fetch_stop_order_fallback
- fetch_stoploss_order
- cancel_stoploss_order
- additional_exchange_init
- _lev_prep
- _get_params
- dry_run_liquidation_price
- check_delisting_time
- _check_delisting_futures
```

--------------------------------------------------------------------------------

---[FILE: bitmart.py]---
Location: freqtrade-develop/freqtrade/exchange/bitmart.py
Signals: N/A
Excerpt (<=80 chars):  class Bitmart(Exchange):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Bitmart
```

--------------------------------------------------------------------------------

---[FILE: bitpanda.py]---
Location: freqtrade-develop/freqtrade/exchange/bitpanda.py
Signals: N/A
Excerpt (<=80 chars):  class Bitpanda(Exchange):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Bitpanda
- get_trades_for_order
```

--------------------------------------------------------------------------------

---[FILE: bitvavo.py]---
Location: freqtrade-develop/freqtrade/exchange/bitvavo.py
Signals: N/A
Excerpt (<=80 chars):  class Bitvavo(Exchange):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Bitvavo
```

--------------------------------------------------------------------------------

---[FILE: bybit.py]---
Location: freqtrade-develop/freqtrade/exchange/bybit.py
Signals: N/A
Excerpt (<=80 chars):  class Bybit(Exchange):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Bybit
- _ccxt_config
- additional_exchange_init
- _lev_prep
- _get_params
- _get_stop_params
- _order_needs_price
- dry_run_liquidation_price
- get_funding_fees
- fetch_order
- get_leverage_tiers
- check_delisting_time
- _check_delisting_futures
```

--------------------------------------------------------------------------------

---[FILE: check_exchange.py]---
Location: freqtrade-develop/freqtrade/exchange/check_exchange.py
Signals: N/A
Excerpt (<=80 chars):  def check_exchange(config: Config, check_for_bad: bool = True) -> bool:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- check_exchange
```

--------------------------------------------------------------------------------

---[FILE: coinex.py]---
Location: freqtrade-develop/freqtrade/exchange/coinex.py
Signals: N/A
Excerpt (<=80 chars):  class Coinex(Exchange):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Coinex
```

--------------------------------------------------------------------------------

---[FILE: common.py]---
Location: freqtrade-develop/freqtrade/exchange/common.py
Signals: N/A
Excerpt (<=80 chars):  def _reset_logging_mixin():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- _reset_logging_mixin
- _get_logging_mixin
- calculate_backoff
- retrier_async
- retrier
- decorator
- wrapper
```

--------------------------------------------------------------------------------

---[FILE: cryptocom.py]---
Location: freqtrade-develop/freqtrade/exchange/cryptocom.py
Signals: N/A
Excerpt (<=80 chars):  class Cryptocom(Exchange):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Cryptocom
```

--------------------------------------------------------------------------------

---[FILE: exchange.py]---
Location: freqtrade-develop/freqtrade/exchange/exchange.py
Signals: N/A
Excerpt (<=80 chars):  class Exchange:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Exchange
- __init__
- __del__
- close
- _init_async_loop
- _set_startup_candle_count
- validate_config
- _init_ccxt
- _ccxt_config
- name
- id
- timeframes
- markets
- precisionMode
- precision_mode_price
- ft_additional_exchange_init
- additional_exchange_init
- _log_exchange_response
```

--------------------------------------------------------------------------------

---[FILE: exchange_types.py]---
Location: freqtrade-develop/freqtrade/exchange/exchange_types.py
Signals: N/A
Excerpt (<=80 chars):  class FtHas(TypedDict, total=False):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FtHas
- Ticker
- OrderBook
- CcxtBalance
- CcxtPosition
```

--------------------------------------------------------------------------------

---[FILE: exchange_utils.py]---
Location: freqtrade-develop/freqtrade/exchange/exchange_utils.py
Signals: N/A
Excerpt (<=80 chars):  def is_exchange_known_ccxt(exchange_name: str, ccxt_module: CcxtModuleType |...

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- is_exchange_known_ccxt
- ccxt_exchanges
- available_exchanges
- validate_exchange
- _build_exchange_list_entry
- list_available_exchanges
- date_minus_candles
- market_is_active
- amount_to_contracts
- contracts_to_amount
- amount_to_precision
- amount_to_contract_precision
- __price_to_precision_significant_digits
- price_to_precision
```

--------------------------------------------------------------------------------

---[FILE: exchange_utils_timeframe.py]---
Location: freqtrade-develop/freqtrade/exchange/exchange_utils_timeframe.py
Signals: N/A
Excerpt (<=80 chars):  def timeframe_to_seconds(timeframe: str) -> int:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- timeframe_to_seconds
- timeframe_to_minutes
- timeframe_to_msecs
- timeframe_to_resample_freq
- timeframe_to_prev_date
- timeframe_to_next_date
```

--------------------------------------------------------------------------------

---[FILE: exchange_ws.py]---
Location: freqtrade-develop/freqtrade/exchange/exchange_ws.py
Signals: N/A
Excerpt (<=80 chars):  class ExchangeWS:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExchangeWS
- __init__
- _start_forever
- cleanup
- reset_connections
- _pop_history
- ohlcvs
- cleanup_expired
- _continuous_stopped
- schedule_ohlcv
```

--------------------------------------------------------------------------------

---[FILE: gate.py]---
Location: freqtrade-develop/freqtrade/exchange/gate.py
Signals: N/A
Excerpt (<=80 chars):  class Gate(Exchange):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Gate
- additional_exchange_init
- _get_params
- get_trades_for_order
- get_order_id_conditional
- fetch_stoploss_order
- cancel_stoploss_order
```

--------------------------------------------------------------------------------

---[FILE: hitbtc.py]---
Location: freqtrade-develop/freqtrade/exchange/hitbtc.py
Signals: N/A
Excerpt (<=80 chars):  class Hitbtc(Exchange):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Hitbtc
```

--------------------------------------------------------------------------------

---[FILE: htx.py]---
Location: freqtrade-develop/freqtrade/exchange/htx.py
Signals: N/A
Excerpt (<=80 chars):  class Htx(Exchange):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Htx
- _get_stop_params
```

--------------------------------------------------------------------------------

---[FILE: hyperliquid.py]---
Location: freqtrade-develop/freqtrade/exchange/hyperliquid.py
Signals: N/A
Excerpt (<=80 chars):  class Hyperliquid(Exchange):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Hyperliquid
- _ccxt_config
- market_is_tradable
- get_max_leverage
- _lev_prep
- dry_run_liquidation_price
- get_funding_fees
- _adjust_hyperliquid_order
- fetch_order
- fetch_orders
```

--------------------------------------------------------------------------------

---[FILE: idex.py]---
Location: freqtrade-develop/freqtrade/exchange/idex.py
Signals: N/A
Excerpt (<=80 chars):  class Idex(Exchange):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Idex
```

--------------------------------------------------------------------------------

````
