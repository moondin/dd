---
source_txt: fullstack_samples/freqtrade-develop
converted_utc: 2025-12-18T10:36:38Z
part: 4
parts_total: 6
---

# FULLSTACK CODE DATABASE SAMPLES freqtrade-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 4 of 6)

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

---[FILE: strategyupdater.py]---
Location: freqtrade-develop/freqtrade/strategy/strategyupdater.py
Signals: N/A
Excerpt (<=80 chars):  class StrategyUpdater:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StrategyUpdater
- start
- update_code
- modify_ast
- NameUpdater
- generic_visit
- visit_Expr
- check_dict
- visit_arguments
- visit_Name
- visit_Import
- visit_ImportFrom
- visit_If
- visit_FunctionDef
- visit_Attribute
- visit_ClassDef
- visit_Subscript
- visit_elts
```

--------------------------------------------------------------------------------

---[FILE: strategy_helper.py]---
Location: freqtrade-develop/freqtrade/strategy/strategy_helper.py
Signals: N/A
Excerpt (<=80 chars):  def merge_informative_pair(

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- merge_informative_pair
- stoploss_from_open
- stoploss_from_absolute
```

--------------------------------------------------------------------------------

---[FILE: strategy_validation.py]---
Location: freqtrade-develop/freqtrade/strategy/strategy_validation.py
Signals: N/A
Excerpt (<=80 chars):  class StrategyResultValidator:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StrategyResultValidator
- __init__
- assert_df
```

--------------------------------------------------------------------------------

---[FILE: strategy_wrapper.py]---
Location: freqtrade-develop/freqtrade/strategy/strategy_wrapper.py
Signals: N/A
Excerpt (<=80 chars):  def __format_traceback(error: Exception) -> str:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- __format_traceback
- strategy_safe_wrapper
- wrapper
```

--------------------------------------------------------------------------------

---[FILE: asyncio_config.py]---
Location: freqtrade-develop/freqtrade/system/asyncio_config.py
Signals: N/A
Excerpt (<=80 chars):  def asyncio_setup() -> None: # pragma: no cover

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- asyncio_setup
```

--------------------------------------------------------------------------------

---[FILE: gc_setup.py]---
Location: freqtrade-develop/freqtrade/system/gc_setup.py
Signals: N/A
Excerpt (<=80 chars):  def gc_set_threshold():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- gc_set_threshold
```

--------------------------------------------------------------------------------

---[FILE: set_mp_start_method.py]---
Location: freqtrade-develop/freqtrade/system/set_mp_start_method.py
Signals: N/A
Excerpt (<=80 chars):  def set_mp_start_method():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- set_mp_start_method
```

--------------------------------------------------------------------------------

---[FILE: version_info.py]---
Location: freqtrade-develop/freqtrade/system/version_info.py
Signals: N/A
Excerpt (<=80 chars):  def print_version_info():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- print_version_info
```

--------------------------------------------------------------------------------

---[FILE: FreqaiExampleHybridStrategy.py]---
Location: freqtrade-develop/freqtrade/templates/FreqaiExampleHybridStrategy.py
Signals: N/A
Excerpt (<=80 chars):  class FreqaiExampleHybridStrategy(IStrategy):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FreqaiExampleHybridStrategy
- feature_engineering_expand_all
- feature_engineering_expand_basic
- feature_engineering_standard
- set_freqai_targets
- populate_indicators
- populate_entry_trend
- populate_exit_trend
```

--------------------------------------------------------------------------------

---[FILE: FreqaiExampleStrategy.py]---
Location: freqtrade-develop/freqtrade/templates/FreqaiExampleStrategy.py
Signals: N/A
Excerpt (<=80 chars):  class FreqaiExampleStrategy(IStrategy):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FreqaiExampleStrategy
- feature_engineering_expand_all
- feature_engineering_expand_basic
- feature_engineering_standard
- set_freqai_targets
- populate_indicators
- populate_entry_trend
- populate_exit_trend
- confirm_trade_entry
```

--------------------------------------------------------------------------------

---[FILE: sample_hyperopt_loss.py]---
Location: freqtrade-develop/freqtrade/templates/sample_hyperopt_loss.py
Signals: N/A
Excerpt (<=80 chars):  class SampleHyperOptLoss(IHyperOptLoss):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SampleHyperOptLoss
- hyperopt_loss_function
```

--------------------------------------------------------------------------------

---[FILE: sample_strategy.py]---
Location: freqtrade-develop/freqtrade/templates/sample_strategy.py
Signals: N/A
Excerpt (<=80 chars): class SampleStrategy(IStrategy):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SampleStrategy
- informative_pairs
- populate_indicators
- populate_entry_trend
- populate_exit_trend
```

--------------------------------------------------------------------------------

---[FILE: coin_gecko.py]---
Location: freqtrade-develop/freqtrade/util/coin_gecko.py
Signals: N/A
Excerpt (<=80 chars):  class FtCoinGeckoApi(CoinGeckoAPI):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FtCoinGeckoApi
- __init__
```

--------------------------------------------------------------------------------

---[FILE: datetime_helpers.py]---
Location: freqtrade-develop/freqtrade/util/datetime_helpers.py
Signals: N/A
Excerpt (<=80 chars):  def dt_now() -> datetime:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dt_now
- dt_utc
- dt_ts
- dt_ts_def
- dt_ts_none
- dt_floor_day
- dt_from_ts
- shorten_date
- dt_humanize_delta
- format_date
- format_ms_time
- format_ms_time_det
```

--------------------------------------------------------------------------------

---[FILE: dry_run_wallet.py]---
Location: freqtrade-develop/freqtrade/util/dry_run_wallet.py
Signals: N/A
Excerpt (<=80 chars):  def get_dry_run_wallet(config: Config) -> int | float:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- get_dry_run_wallet
```

--------------------------------------------------------------------------------

---[FILE: formatters.py]---
Location: freqtrade-develop/freqtrade/util/formatters.py
Signals: N/A
Excerpt (<=80 chars):  def decimals_per_coin(coin: str):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- decimals_per_coin
- strip_trailing_zeros
- round_value
- fmt_coin
- fmt_coin2
- format_duration
- format_pct
```

--------------------------------------------------------------------------------

---[FILE: ft_precise.py]---
Location: freqtrade-develop/freqtrade/util/ft_precise.py
Signals: N/A
Excerpt (<=80 chars):  class FtPrecise(Precise):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FtPrecise
- __init__
```

--------------------------------------------------------------------------------

---[FILE: ft_ttlcache.py]---
Location: freqtrade-develop/freqtrade/util/ft_ttlcache.py
Signals: N/A
Excerpt (<=80 chars):  class FtTTLCache(TTLCache):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FtTTLCache
- __init__
```

--------------------------------------------------------------------------------

---[FILE: measure_time.py]---
Location: freqtrade-develop/freqtrade/util/measure_time.py
Signals: N/A
Excerpt (<=80 chars):  class MeasureTime:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MeasureTime
- __init__
- __enter__
- __exit__
```

--------------------------------------------------------------------------------

---[FILE: periodic_cache.py]---
Location: freqtrade-develop/freqtrade/util/periodic_cache.py
Signals: N/A
Excerpt (<=80 chars):  class PeriodicCache(TTLCache):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PeriodicCache
- __init__
- local_timer
```

--------------------------------------------------------------------------------

---[FILE: progress_tracker.py]---
Location: freqtrade-develop/freqtrade/util/progress_tracker.py
Signals: N/A
Excerpt (<=80 chars):  def retrieve_progress_tracker(pt: CustomProgress | None) -> CustomProgress:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- retrieve_progress_tracker
- get_progress_tracker
```

--------------------------------------------------------------------------------

---[FILE: rich_progress.py]---
Location: freqtrade-develop/freqtrade/util/rich_progress.py
Signals: N/A
Excerpt (<=80 chars):  class CustomProgress(Progress):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CustomProgress
- __init__
- update
- get_renderable
```

--------------------------------------------------------------------------------

---[FILE: rich_tables.py]---
Location: freqtrade-develop/freqtrade/util/rich_tables.py
Signals: N/A
Excerpt (<=80 chars):  def print_rich_table(

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- print_rich_table
- _format_value
- print_df_rich_table
```

--------------------------------------------------------------------------------

---[FILE: template_renderer.py]---
Location: freqtrade-develop/freqtrade/util/template_renderer.py
Signals: N/A
Excerpt (<=80 chars):  def render_template(templatefile: str, arguments: dict) -> str:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- render_template
- render_template_with_fallback
```

--------------------------------------------------------------------------------

---[FILE: binance_mig.py]---
Location: freqtrade-develop/freqtrade/util/migrations/binance_mig.py
Signals: SQLAlchemy
Excerpt (<=80 chars):  def migrate_binance_futures_names(config: Config):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- migrate_binance_futures_names
- _migrate_binance_futures_db
- migrate_binance_futures_data
```

--------------------------------------------------------------------------------

---[FILE: funding_rate_mig.py]---
Location: freqtrade-develop/freqtrade/util/migrations/funding_rate_mig.py
Signals: N/A
Excerpt (<=80 chars):  def migrate_funding_fee_timeframe(config: Config, exchange: Exchange | None):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- migrate_funding_fee_timeframe
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: freqtrade-develop/freqtrade/util/migrations/__init__.py
Signals: N/A
Excerpt (<=80 chars):  def migrate_data(config, exchange: Exchange | None = None) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- migrate_data
- migrate_live_content
```

--------------------------------------------------------------------------------

---[FILE: indicators.py]---
Location: freqtrade-develop/freqtrade/vendor/qtpylib/indicators.py
Signals: N/A
Excerpt (<=80 chars):  def numpy_rolling_window(data, window):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- numpy_rolling_window
- numpy_rolling_series
- func_wrapper
- numpy_rolling_mean
- numpy_rolling_std
- session
- heikinashi
- tdi
- awesome_oscillator
- nans
- typical_price
- mid_price
- ibs
- true_range
- atr
- crossed
- crossed_above
- crossed_below
```

--------------------------------------------------------------------------------

---[FILE: ft_client.py]---
Location: freqtrade-develop/ft_client/freqtrade_client/ft_client.py
Signals: N/A
Excerpt (<=80 chars):  def add_arguments(args: Any = None):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- add_arguments
- load_config
- print_commands
- main_exec
- main
```

--------------------------------------------------------------------------------

---[FILE: ft_rest_client.py]---
Location: freqtrade-develop/ft_client/freqtrade_client/ft_rest_client.py
Signals: N/A
Excerpt (<=80 chars):  class FtRestClient:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FtRestClient
- __init__
- _call
- _get
- _delete
- _post
- start
- stop
- stopbuy
- reload_config
- balance
- count
- entries
- exits
- mix_tags
- locks
- delete_lock
- lock_add
```

--------------------------------------------------------------------------------

---[FILE: test_rest_client.py]---
Location: freqtrade-develop/ft_client/test_client/test_rest_client.py
Signals: N/A
Excerpt (<=80 chars):  def log_has_re(line, logs):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- log_has_re
- get_rest_client
- test_FtRestClient_init
- test_FtRestClient_call
- test_FtRestClient_call_invalid
- test_FtRestClient_call_explicit_methods
- test_ft_client
- test_ft_client_argparsing
```

--------------------------------------------------------------------------------

---[FILE: ws_client.py]---
Location: freqtrade-develop/scripts/ws_client.py
Signals: N/A
Excerpt (<=80 chars):  def setup_logging(filename: str):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- setup_logging
- parse_args
- load_config
- readable_timedelta
- json_serialize
- json_deserialize
- json_to_dataframe
- _json_object_hook
- ClientProtocol
- _calculate_time_difference
- main
```

--------------------------------------------------------------------------------

---[FILE: conftest.py]---
Location: freqtrade-develop/tests/conftest.py
Signals: N/A
Excerpt (<=80 chars):  def pytest_addoption(parser):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pytest_addoption
- pytest_configure
- FixtureScheduler
- _split_scope
- pytest_xdist_make_scheduler
- log_has
- log_has_when
- log_has_re
- num_log_has
- num_log_has_re
- get_args
- generate_trades_history
- generate_test_data
- generate_test_data_raw
- get_mock_coro
- patched_configuration_load_config_file
- patch_exchange
- get_patched_exchange
```

--------------------------------------------------------------------------------

---[FILE: conftest_hyperopt.py]---
Location: freqtrade-develop/tests/conftest_hyperopt.py
Signals: N/A
Excerpt (<=80 chars):  def hyperopt_test_result():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- hyperopt_test_result
```

--------------------------------------------------------------------------------

---[FILE: conftest_trades.py]---
Location: freqtrade-develop/tests/conftest_trades.py
Signals: N/A
Excerpt (<=80 chars):  def entry_side(is_short: bool):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- entry_side
- exit_side
- direc
- mock_order_1
- mock_trade_1
- mock_order_2
- mock_order_2_sell
- mock_trade_2
- mock_order_3
- mock_order_3_sell
- mock_trade_3
- mock_order_4
- mock_trade_4
- mock_order_5
- mock_order_5_stoploss
- mock_trade_5
- mock_order_6
- mock_order_6_sell
```

--------------------------------------------------------------------------------

---[FILE: conftest_trades_usdt.py]---
Location: freqtrade-develop/tests/conftest_trades_usdt.py
Signals: N/A
Excerpt (<=80 chars):  def entry_side(is_short: bool):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- entry_side
- exit_side
- direc
- mock_order_usdt_1
- mock_order_usdt_1_exit
- mock_trade_usdt_1
- mock_order_usdt_2
- mock_order_usdt_2_exit
- mock_trade_usdt_2
- mock_order_usdt_3
- mock_order_usdt_3_exit
- mock_trade_usdt_3
- mock_order_usdt_4
- mock_trade_usdt_4
- mock_order_usdt_5
- mock_order_usdt_5_stoploss
- mock_trade_usdt_5
- mock_order_usdt_6
```

--------------------------------------------------------------------------------

---[FILE: test_arguments.py]---
Location: freqtrade-develop/tests/test_arguments.py
Signals: N/A
Excerpt (<=80 chars):  def test_available_cli_options():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_available_cli_options
- test_arguments_match_available_cli_options
- build_args_monitor
- test_parse_args_none
- test_parse_args_defaults
- test_parse_args_default_userdatadir
- test_parse_args_userdatadir
- test_parse_args_config
- test_parse_args_db_url
- test_parse_args_verbose
- test_common_scripts_options
- test_parse_args_version
- test_parse_args_invalid
- test_parse_args_strategy
- test_parse_args_strategy_invalid
- test_parse_args_strategy_path
- test_parse_args_strategy_path_invalid
- test_parse_args_backtesting_invalid
```

--------------------------------------------------------------------------------

---[FILE: test_configuration.py]---
Location: freqtrade-develop/tests/test_configuration.py
Signals: N/A
Excerpt (<=80 chars): def all_conf():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- all_conf
- test_load_config_missing_attributes
- test_load_config_incorrect_stake_amount
- test_load_config_file
- test_load_config_file_error
- test_load_config_file_error_range
- test_load_file_error
- test__args_to_config
- test_load_config_max_open_trades_zero
- test_load_config_combine_dicts
- test_from_config
- test_from_recursive_files
- test_print_config
- test_load_config_max_open_trades_minus_one
- test_load_config_file_exception
- test_load_config
- test_load_config_with_params
- test_load_dry_run
```

--------------------------------------------------------------------------------

---[FILE: test_directory_operations.py]---
Location: freqtrade-develop/tests/test_directory_operations.py
Signals: N/A
Excerpt (<=80 chars):  def test_create_datadir(mocker, default_conf, caplog) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_create_datadir
- test_create_userdata_dir
- test_create_userdata_dir_and_chown
- test_create_userdata_dir_exists
- test_create_userdata_dir_exists_exception
- test_copy_sample_files
- test_copy_sample_files_errors
```

--------------------------------------------------------------------------------

---[FILE: test_indicators.py]---
Location: freqtrade-develop/tests/test_indicators.py
Signals: N/A
Excerpt (<=80 chars):  def test_crossed_numpy_types():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_crossed_numpy_types
```

--------------------------------------------------------------------------------

---[FILE: test_log_setup.py]---
Location: freqtrade-develop/tests/test_log_setup.py
Signals: N/A
Excerpt (<=80 chars): def test_set_loggers() -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_set_loggers
- test_set_loggers_syslog
- test_set_loggers_Filehandler
- test_set_loggers_Filehandler_without_permission
- test_set_loggers_journald
- test_set_loggers_journald_importerror
- test_set_loggers_json_format
- test_reduce_verbosity
```

--------------------------------------------------------------------------------

---[FILE: test_main.py]---
Location: freqtrade-develop/tests/test_main.py
Signals: N/A
Excerpt (<=80 chars):  def test_parse_args_None(caplog) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_parse_args_None
- test_parse_args_version
- test_parse_args_backtesting
- test_main_start_hyperopt
- test_main_fatal_exception
- test_main_keyboard_interrupt
- test_main_operational_exception
- test_main_operational_exception1
- test_main_ConfigurationError
- test_main_reload_config
- test_reconfigure
```

--------------------------------------------------------------------------------

---[FILE: test_misc.py]---
Location: freqtrade-develop/tests/test_misc.py
Signals: N/A
Excerpt (<=80 chars):  def test_file_dump_json(mocker) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_file_dump_json
- test_file_load_json
- test_is_file_in_dir
- test_pair_to_filename
- test_safe_value_fallback
- test_safe_value_fallback2
- test_plural
- test_parse_db_uri_for_logging
- test_deep_merge_dicts
- test_dataframe_json
```

--------------------------------------------------------------------------------

---[FILE: test_plotting.py]---
Location: freqtrade-develop/tests/test_plotting.py
Signals: N/A
Excerpt (<=80 chars):  def fig_generating_mock(fig, *args, **kwargs):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- fig_generating_mock
- find_trace_in_fig_data
- generate_empty_figure
- test_init_plotscript
- test_add_indicators
- test_add_areas
- test_plot_trades
- test_generate_candlestick_graph_no_signals_no_trades
- test_generate_candlestick_graph_no_trades
- test_generate_Plot_filename
- test_generate_plot_file
- test_add_profit
- test_generate_profit_graph
- test_start_plot_dataframe
- test_load_and_plot_trades
- test_start_plot_profit
- test_start_plot_profit_error
- test_plot_profit
```

--------------------------------------------------------------------------------

---[FILE: test_strategy_updater.py]---
Location: freqtrade-develop/tests/test_strategy_updater.py
Signals: N/A
Excerpt (<=80 chars):  def test_strategy_updater_start(user_dir, capsys) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_strategy_updater_start
- test_strategy_updater_methods
- testClass
- populate_buy_trend
- populate_sell_trend
- check_buy_timeout
- check_sell_timeout
- custom_sell
- test_strategy_updater_params
- test_strategy_updater_constants
- test_strategy_updater_df_columns
- test_strategy_updater_method_params
- confirm_trade_exit
- test_strategy_updater_dicts
- test_strategy_updater_comparisons
- test_strategy_updater_strings
- test_strategy_updater_comments
```

--------------------------------------------------------------------------------

---[FILE: test_talib.py]---
Location: freqtrade-develop/tests/test_talib.py
Signals: N/A
Excerpt (<=80 chars):  def test_talib_bollingerbands_near_zero_values():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_talib_bollingerbands_near_zero_values
```

--------------------------------------------------------------------------------

---[FILE: test_timerange.py]---
Location: freqtrade-develop/tests/test_timerange.py
Signals: N/A
Excerpt (<=80 chars):  def test_parse_timerange_incorrect():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_parse_timerange_incorrect
- test_subtract_start
- test_adjust_start_if_necessary
```

--------------------------------------------------------------------------------

---[FILE: test_wallets.py]---
Location: freqtrade-develop/tests/test_wallets.py
Signals: SQLAlchemy
Excerpt (<=80 chars):  def test_sync_wallet_at_boot(mocker, default_conf):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_sync_wallet_at_boot
- test_sync_wallet_missing_data
- test_get_trade_stake_amount_no_stake_amount
- test_get_trade_stake_amount_unlimited_amount
- test_validate_stake_amount
- test_get_starting_balance
- test_sync_wallet_futures_live
- test_sync_wallet_dry
- test_sync_wallet_futures_dry
- test_check_exit_amount
- test_check_exit_amount_futures
- test_dry_run_wallet_initialization
```

--------------------------------------------------------------------------------

---[FILE: test_build_config.py]---
Location: freqtrade-develop/tests/commands/test_build_config.py
Signals: N/A
Excerpt (<=80 chars):  def test_validate_is_float():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_validate_is_float
- test_validate_is_int
- test_start_new_config
- test_start_new_config_exists
- test_ask_user_overwrite
- test_ask_user_config
```

--------------------------------------------------------------------------------

---[FILE: test_commands.py]---
Location: freqtrade-develop/tests/commands/test_commands.py
Signals: N/A
Excerpt (<=80 chars):  def test_setup_utils_configuration():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_setup_utils_configuration
- test_start_trading_fail
- test_start_webserver
- test_list_exchanges
- test_list_timeframes
- test_list_markets
- test_create_datadir_failed
- test_create_datadir
- test_start_new_strategy
- test_start_new_strategy_no_arg
- test_start_install_ui
- test_clean_ui_subdir
- test_download_and_install_ui
- test_get_ui_download_url
- test_get_ui_download_url_direct
- test_download_data_keyboardInterrupt
- test_download_data_timerange
- test_download_data_no_exchange
```

--------------------------------------------------------------------------------

---[FILE: test_startup_time.py]---
Location: freqtrade-develop/tests/commands/test_startup_time.py
Signals: N/A
Excerpt (<=80 chars):  def test_startup_time():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_startup_time
```

--------------------------------------------------------------------------------

---[FILE: test_btanalysis.py]---
Location: freqtrade-develop/tests/data/test_btanalysis.py
Signals: N/A
Excerpt (<=80 chars):  def test_get_latest_backtest_filename(testdatadir, mocker):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_get_latest_backtest_filename
- test_get_latest_hyperopt_file
- test_load_backtest_metadata
- test_load_backtest_data_old_format
- test_load_backtest_data_new_format
- test_load_backtest_data_multi
- test_load_trades_from_db
- test_extract_trades_of_period
- test_analyze_trade_parallelism
- test_load_trades
- test_calculate_market_change
- test_combine_dataframes_with_mean
- test_combined_dataframes_with_rel_mean
- test_combine_dataframes_with_mean_no_data
- test_create_cum_profit
- test_create_cum_profit1
- test_calculate_max_drawdown
- test_calculate_csum
```

--------------------------------------------------------------------------------

---[FILE: test_converter.py]---
Location: freqtrade-develop/tests/data/test_converter.py
Signals: N/A
Excerpt (<=80 chars):  def test_dataframe_correct_columns(dataframe_1m):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_dataframe_correct_columns
- test_ohlcv_to_dataframe
- test_trades_to_ohlcv
- test_trades_to_ohlcv_multi
- test_ohlcv_fill_up_missing_data
- test_ohlcv_fill_up_missing_data2
- test_ohlcv_to_dataframe_multi
- test_ohlcv_to_dataframe_1M
- test_ohlcv_drop_incomplete
- test_trim_dataframe
- test_trades_df_remove_duplicates
- test_trades_dict_to_list
- test_convert_trades_format
- test_convert_ohlcv_format
- test_reduce_dataframe_footprint
- test_convert_trades_to_ohlcv
- test_order_book_to_dataframe
- test_order_book_to_dataframe_empty
```

--------------------------------------------------------------------------------

---[FILE: test_converter_orderflow.py]---
Location: freqtrade-develop/tests/data/test_converter_orderflow.py
Signals: N/A
Excerpt (<=80 chars):  def read_csv(filename):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- read_csv
- populate_dataframe_with_trades_dataframe
- populate_dataframe_with_trades_trades
- candles
- public_trades_list
- public_trades_list_simple
- test_public_trades_columns_before_change
- test_public_trades_mock_populate_dataframe_with_trades__check_orderflow
- test_public_trades_trades_mock_populate_dataframe_with_trades__check_trades
- test_public_trades_put_volume_profile_into_ohlcv_candles
- test_public_trades_binned_big_sample_list
- test_public_trades_config_max_trades
- test_public_trades_testdata_sanity
- test_analyze_with_orderflow
- test_stacked_imbalances_multiple_prices
- test_timeframe_to_DateOffset
```

--------------------------------------------------------------------------------

---[FILE: test_datahandler.py]---
Location: freqtrade-develop/tests/data/test_datahandler.py
Signals: N/A
Excerpt (<=80 chars):  def test_datahandler_ohlcv_get_pairs(testdatadir):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_datahandler_ohlcv_get_pairs
- test_datahandler_ohlcv_regex
- test_rebuild_pair_from_filename
- test_datahandler_ohlcv_get_available_data
- test_jsondatahandler_ohlcv_purge
- test_jsondatahandler_ohlcv_load
- test_datahandler_ohlcv_data_min_max
- test_datahandler__check_empty_df
- test_datahandler_trades_not_supported
- test_jsondatahandler_trades_load
- test_datahandler_ohlcv_append
- test_datahandler_trades_append
- test_datahandler_trades_get_pairs
- test_hdf5datahandler_deprecated
- test_generic_datahandler_ohlcv_load_and_resave
- test_datahandler_trades_load
- test_datahandler_trades_store
- test_datahandler_trades_purge
```

--------------------------------------------------------------------------------

---[FILE: test_dataprovider.py]---
Location: freqtrade-develop/tests/data/test_dataprovider.py
Signals: N/A
Excerpt (<=80 chars): def test_dp_ohlcv(mocker, default_conf, ohlcv_history, candle_type):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_dp_ohlcv
- test_historic_ohlcv
- test_historic_trades
- test_historic_ohlcv_dataformat
- test_get_pair_dataframe
- test_get_pair_dataframe_funding_rate
- test_available_pairs
- test_producer_pairs
- test_get_producer_df
- test_emit_df
- test_refresh
- test_orderbook
- test_market
- test_ticker
- test_current_whitelist
- test_get_analyzed_dataframe
- test_no_exchange_mode
- test_dp_send_msg
```

--------------------------------------------------------------------------------

---[FILE: test_download_data.py]---
Location: freqtrade-develop/tests/data/test_download_data.py
Signals: N/A
Excerpt (<=80 chars):  def test_download_data_main_no_markets(mocker, caplog):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_download_data_main_no_markets
- test_download_data_main_all_pairs
- test_download_data_main_trades
- test_download_data_main_data_invalid
```

--------------------------------------------------------------------------------

---[FILE: test_entryexitanalysis.py]---
Location: freqtrade-develop/tests/data/test_entryexitanalysis.py
Signals: N/A
Excerpt (<=80 chars): def entryexitanalysis_cleanup() -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- entryexitanalysis_cleanup
- test_backtest_analysis_on_entry_and_rejected_signals_nomock
- test_backtest_analysis_with_invalid_config
- test_backtest_analysis_on_entry_and_rejected_signals_only_entry_signals
```

--------------------------------------------------------------------------------

---[FILE: test_historic_precision.py]---
Location: freqtrade-develop/tests/data/test_historic_precision.py
Signals: N/A
Excerpt (<=80 chars):  def test_get_tick_size_over_time():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_get_tick_size_over_time
- test_get_tick_size_over_time_real_data
- test_get_tick_size_over_time_small_numbers
```

--------------------------------------------------------------------------------

---[FILE: test_history.py]---
Location: freqtrade-develop/tests/data/test_history.py
Signals: N/A
Excerpt (<=80 chars):  def _clean_test_file(file: Path) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- _clean_test_file
- test_load_data_30min_timeframe
- test_load_data_7min_timeframe
- test_load_data_1min_timeframe
- test_load_data_mark
- test_load_data_startup_candles
- test_load_data_with_new_pair_1min
- test_testdata_path
- test_json_pair_data_filename
- test_json_pair_trades_filename
- test_load_cached_data_for_updating
- test_download_pair_history
- test_download_pair_history2
- test_download_backtesting_data_exception
- test_load_partial_missing
- test_init
- test_init_with_refresh
- test_file_dump_json_tofile
```

--------------------------------------------------------------------------------

---[FILE: test_trade_converter_kraken.py]---
Location: freqtrade-develop/tests/data/test_trade_converter_kraken.py
Signals: N/A
Excerpt (<=80 chars):  def test_import_kraken_trades_from_csv(testdatadir, tmp_path, caplog, defaul...

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_import_kraken_trades_from_csv
```

--------------------------------------------------------------------------------

---[FILE: test_binance.py]---
Location: freqtrade-develop/tests/exchange/test_binance.py
Signals: N/A
Excerpt (<=80 chars): def test__get_params_binance(default_conf, mocker, side, order_type, time_in_...

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test__get_params_binance
- test_create_stoploss_order_binance
- test_create_stoploss_order_dry_run_binance
- test_stoploss_adjust_binance
- test_liquidation_price_binance
- get_maint_ratio
- fetch_funding_rates
- test_fill_leverage_tiers_binance
- test_fill_leverage_tiers_binance_dryrun
- test_additional_exchange_init_binance
- test__set_leverage_binance
- patch_binance_vision_ohlcv
- make_storage
- get_historic_ohlcv
- test_get_historic_ohlcv_binance
- test_get_maintenance_ratio_and_amt_binance
- test_check_delisting_time_binance
- test__check_delisting_futures_binance
```

--------------------------------------------------------------------------------

---[FILE: test_binance_public_data.py]---
Location: freqtrade-develop/tests/exchange/test_binance_public_data.py
Signals: N/A
Excerpt (<=80 chars): def event_loop_policy(request):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- event_loop_policy
- MockResponse
- __init__
- make_response_from_url
- make_daily_df
- make_daily_zip
- make_response
```

--------------------------------------------------------------------------------

---[FILE: test_bitget.py]---
Location: freqtrade-develop/tests/exchange/test_bitget.py
Signals: N/A
Excerpt (<=80 chars): def test_fetch_stoploss_order_bitget(default_conf, mocker):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_fetch_stoploss_order_bitget
- test_fetch_stoploss_order_bitget_exceptions
- test_bitget_ohlcv_candle_limit
- test_additional_exchange_init_bitget
- test_dry_run_liquidation_price_cross_bitget
- test__lev_prep_bitget
- test_check_delisting_time_bitget
- test__check_delisting_futures_bitget
```

--------------------------------------------------------------------------------

---[FILE: test_bitpanda.py]---
Location: freqtrade-develop/tests/exchange/test_bitpanda.py
Signals: N/A
Excerpt (<=80 chars):  def test_get_trades_for_order(default_conf, mocker):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_get_trades_for_order
```

--------------------------------------------------------------------------------

---[FILE: test_bybit.py]---
Location: freqtrade-develop/tests/exchange/test_bybit.py
Signals: N/A
Excerpt (<=80 chars):  def test_additional_exchange_init_bybit(default_conf, mocker, caplog):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_additional_exchange_init_bybit
- test_bybit_get_funding_fees
- test_bybit_fetch_orders
- exchange_has
- test_bybit_fetch_order_canceled_empty
- test_bybit__order_needs_price
- test_check_delisting_time_bybit
- test__check_delisting_futures_bybit
```

--------------------------------------------------------------------------------

---[FILE: test_exchange.py]---
Location: freqtrade-develop/tests/exchange/test_exchange.py
Signals: N/A
Excerpt (<=80 chars):  def ccxt_exceptionhandlers(

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ccxt_exceptionhandlers
- test_init
- test_init_ccxt_kwargs
- test_destroy
- test_init_exception
- test_exchange_resolver
- test_validate_order_time_in_force
- test_validate_orderflow
- test_validate_freqai_compat
- test_price_get_one_pip
- test__get_stake_amount_limit
- test_get_min_pair_stake_amount_real_data
- test__load_async_markets
- test__load_markets
- test_reload_markets
- test_reload_markets_exception
- test_validate_stakecurrency
- test_validate_stakecurrency_error
```

--------------------------------------------------------------------------------

---[FILE: test_exchange_utils.py]---
Location: freqtrade-develop/tests/exchange/test_exchange_utils.py
Signals: N/A
Excerpt (<=80 chars):  def test_check_exchange(default_conf, caplog) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_check_exchange
- test_date_minus_candles
- test_timeframe_to_minutes
- test_timeframe_to_seconds
- test_timeframe_to_msecs
- test_timeframe_to_resample_freq
- test_timeframe_to_prev_date
- test_timeframe_to_next_date
- test_amount_to_precision
- test_price_to_precision
- test_amount_to_contract_precision_standalone
```

--------------------------------------------------------------------------------

---[FILE: test_exchange_ws.py]---
Location: freqtrade-develop/tests/exchange/test_exchange_ws.py
Signals: N/A
Excerpt (<=80 chars):  def test_exchangews_init(mocker):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_exchangews_init
- test_exchangews_cleanup_error
- patch_eventloop_threading
- thread_func
```

--------------------------------------------------------------------------------

---[FILE: test_gate.py]---
Location: freqtrade-develop/tests/exchange/test_gate.py
Signals: N/A
Excerpt (<=80 chars): def test_fetch_stoploss_order_gate(default_conf, mocker):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_fetch_stoploss_order_gate
- test_cancel_stoploss_order_gate
- test_stoploss_adjust_gate
- test_fetch_my_trades_gate
```

--------------------------------------------------------------------------------

---[FILE: test_htx.py]---
Location: freqtrade-develop/tests/exchange/test_htx.py
Signals: N/A
Excerpt (<=80 chars): def test_create_stoploss_order_htx(default_conf, mocker, limitratio, expected...

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_create_stoploss_order_htx
- test_create_stoploss_order_dry_run_htx
- test_stoploss_adjust_htx
```

--------------------------------------------------------------------------------

---[FILE: test_hyperliquid.py]---
Location: freqtrade-develop/tests/exchange/test_hyperliquid.py
Signals: N/A
Excerpt (<=80 chars): def test_hyperliquid_dry_run_liquidation_price(default_conf, mocker, margin_m...

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_hyperliquid_dry_run_liquidation_price
- test_hyperliquid_get_funding_fees
- test_hyperliquid_get_max_leverage
- test_hyperliquid__lev_prep
- test_hyperliquid_fetch_order
```

--------------------------------------------------------------------------------

---[FILE: test_kraken.py]---
Location: freqtrade-develop/tests/exchange/test_kraken.py
Signals: N/A
Excerpt (<=80 chars): def test_kraken_trading_agreement(default_conf, mocker, order_type, time_in_f...

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_kraken_trading_agreement
- test_get_balances_prod_kraken
- test_create_stoploss_order_kraken
- test_create_stoploss_order_dry_run_kraken
- test_stoploss_adjust_kraken
- test__valid_trade_pagination_id_kraken
```

--------------------------------------------------------------------------------

---[FILE: test_kucoin.py]---
Location: freqtrade-develop/tests/exchange/test_kucoin.py
Signals: N/A
Excerpt (<=80 chars): def test_create_stoploss_order_kucoin(default_conf, mocker, limitratio, expec...

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_create_stoploss_order_kucoin
- test_stoploss_order_dry_run_kucoin
- test_stoploss_adjust_kucoin
- test_kucoin_create_order
```

--------------------------------------------------------------------------------

````
