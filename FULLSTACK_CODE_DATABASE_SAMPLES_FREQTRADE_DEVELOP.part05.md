---
source_txt: fullstack_samples/freqtrade-develop
converted_utc: 2025-12-18T10:36:38Z
part: 5
parts_total: 6
---

# FULLSTACK CODE DATABASE SAMPLES freqtrade-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 5 of 6)

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

---[FILE: test_okx.py]---
Location: freqtrade-develop/tests/exchange/test_okx.py
Signals: N/A
Excerpt (<=80 chars):  def test_okx_ohlcv_candle_limit(default_conf, mocker):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_okx_ohlcv_candle_limit
- test_get_maintenance_ratio_and_amt_okx
- test_get_max_pair_stake_amount_okx
- test__get_posSide
- test_additional_exchange_init_okx
- test_load_leverage_tiers_okx
- test__set_leverage_okx
- test_fetch_stoploss_order_okx
- test_fetch_stoploss_order_okx_exceptions
- test_stoploss_adjust_okx
- test_stoploss_cancel_okx
- test__get_stop_params_okx
- test_fetch_orders_okx
- has_resp
```

--------------------------------------------------------------------------------

---[FILE: conftest.py]---
Location: freqtrade-develop/tests/exchange_online/conftest.py
Signals: N/A
Excerpt (<=80 chars): def exchange_conf():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- exchange_conf
- set_test_proxy
- get_exchange
- get_futures_exchange
- exchange
- exchange_futures
- exchange_mode
- exchange_ws
```

--------------------------------------------------------------------------------

---[FILE: test_ccxt_compat.py]---
Location: freqtrade-develop/tests/exchange_online/test_ccxt_compat.py
Signals: N/A
Excerpt (<=80 chars): class TestCCXTExchange:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestCCXTExchange
- test_load_markets
- test_has_validations
- test_ohlcv_limit
- test_ohlcv_limit_futures
- test_load_markets_futures
- test_ccxt_order_parse
- test_ccxt_my_trades_parse
- test_ccxt_balances_parse
- test_ccxt_fetch_tickers
- test_ccxt_fetch_tickers_futures
- test_ccxt_fetch_ticker
- test_ccxt_fetch_l2_orderbook
- test_ccxt_fetch_ohlcv
- test_ccxt_fetch_ohlcv_startdate
- _ccxt__async_get_candle_history
- test_ccxt__async_get_candle_history
- test_ccxt__async_get_candle_history_futures
```

--------------------------------------------------------------------------------

---[FILE: test_ccxt_ws_compat.py]---
Location: freqtrade-develop/tests/exchange_online/test_ccxt_ws_compat.py
Signals: N/A
Excerpt (<=80 chars): class TestCCXTExchangeWs:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestCCXTExchangeWs
- test_ccxt_watch_ohlcv
```

--------------------------------------------------------------------------------

---[FILE: conftest.py]---
Location: freqtrade-develop/tests/freqai/conftest.py
Signals: N/A
Excerpt (<=80 chars):  def is_py12() -> bool:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- is_py12
- freqai_conf
- make_rl_config
- mock_pytorch_mlp_model_training_parameters
- get_patched_data_kitchen
- get_patched_data_drawer
- get_patched_freqai_strategy
- get_patched_freqaimodel
- make_unfiltered_dataframe
- make_data_dictionary
- get_freqai_live_analyzed_dataframe
- get_freqai_analyzed_dataframe
- get_ready_to_train
```

--------------------------------------------------------------------------------

---[FILE: test_freqai_backtesting.py]---
Location: freqtrade-develop/tests/freqai/test_freqai_backtesting.py
Signals: N/A
Excerpt (<=80 chars):  def test_freqai_backtest_start_backtest_list(freqai_conf, mocker, testdatadi...

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_freqai_backtest_start_backtest_list
- test_freqai_backtest_load_data
- test_freqai_backtest_live_models_model_not_found
- test_freqai_backtest_consistent_timerange
```

--------------------------------------------------------------------------------

---[FILE: test_freqai_datadrawer.py]---
Location: freqtrade-develop/tests/freqai/test_freqai_datadrawer.py
Signals: N/A
Excerpt (<=80 chars):  def test_update_historic_data(mocker, freqai_conf):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_update_historic_data
- test_load_all_pairs_histories
- test_get_base_and_corr_dataframes
- test_use_strategy_to_populate_indicators
- test_get_timerange_from_live_historic_predictions
- test_get_timerange_from_backtesting_live_df_pred_not_found
- test_set_initial_return_values
- test_set_initial_return_values_warning
```

--------------------------------------------------------------------------------

---[FILE: test_freqai_datakitchen.py]---
Location: freqtrade-develop/tests/freqai/test_freqai_datakitchen.py
Signals: N/A
Excerpt (<=80 chars): def test_create_fulltimerange(

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_create_fulltimerange
- test_create_fulltimerange_incorrect_backtest_period
- test_split_timerange
- test_check_if_model_expired
- test_filter_features
- test_make_train_test_datasets
- test_get_full_model_path
- test_get_pair_data_for_features_with_prealoaded_data
- test_get_pair_data_for_features_without_preloaded_data
- test_populate_features
```

--------------------------------------------------------------------------------

---[FILE: test_freqai_interface.py]---
Location: freqtrade-develop/tests/freqai/test_freqai_interface.py
Signals: N/A
Excerpt (<=80 chars):  def can_run_model(model: str) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- can_run_model
- test_extract_data_and_train_model_Standard
- test_extract_data_and_train_model_MultiTargets
- test_extract_data_and_train_model_Classifiers
- test_start_backtesting
- test_start_backtesting_subdaily_backtest_period
- test_start_backtesting_from_existing_folder
- test_backtesting_fit_live_predictions
- test_plot_feature_importance
- test_freqai_informative_pairs
- test_start_set_train_queue
- test_get_required_data_timerange
- test_download_all_data_for_training
- test_get_state_info
```

--------------------------------------------------------------------------------

---[FILE: ReinforcementLearner_test_3ac.py]---
Location: freqtrade-develop/tests/freqai/test_models/ReinforcementLearner_test_3ac.py
Signals: N/A
Excerpt (<=80 chars):  class ReinforcementLearner_test_3ac(ReinforcementLearner):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReinforcementLearner_test_3ac
- MyRLEnv
- calculate_reward
```

--------------------------------------------------------------------------------

---[FILE: ReinforcementLearner_test_4ac.py]---
Location: freqtrade-develop/tests/freqai/test_models/ReinforcementLearner_test_4ac.py
Signals: N/A
Excerpt (<=80 chars):  class ReinforcementLearner_test_4ac(ReinforcementLearner):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReinforcementLearner_test_4ac
- MyRLEnv
- calculate_reward
```

--------------------------------------------------------------------------------

---[FILE: test_freqtradebot.py]---
Location: freqtrade-develop/tests/freqtradebot/test_freqtradebot.py
Signals: SQLAlchemy
Excerpt (<=80 chars):  def patch_RPCManager(mocker) -> MagicMock:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- patch_RPCManager
- test_freqtradebot_state
- test_process_stopped
- test_process_calls_sendmsg
- test_bot_cleanup
- test_bot_cleanup_db_errors
- test_order_dict
- test_get_trade_stake_amount
- test_load_strategy_no_keys
- test_check_available_stake_amount
- test_total_open_trades_stakes
- test_create_trade
- test_create_trade_no_stake_amount
- test_create_trade_minimal_amount
- test_enter_positions_no_pairs_left
- test_enter_positions_global_pairlock
- test_handle_protections
- test_create_trade_no_signal
```

--------------------------------------------------------------------------------

---[FILE: test_integration.py]---
Location: freqtrade-develop/tests/freqtradebot/test_integration.py
Signals: SQLAlchemy
Excerpt (<=80 chars):  def test_may_execute_exit_stoploss_on_exchange_multi(default_conf, ticker, f...

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_may_execute_exit_stoploss_on_exchange_multi
- patch_stoploss
- test_forcebuy_last_unlimited
- test_dca_buying
- test_dca_short
- test_dca_order_adjust
- test_dca_order_adjust_entry_replace_fails
- test_dca_exiting
- test_dca_handle_similar_open_order
```

--------------------------------------------------------------------------------

---[FILE: test_stoploss_on_exchange.py]---
Location: freqtrade-develop/tests/freqtradebot/test_stoploss_on_exchange.py
Signals: SQLAlchemy
Excerpt (<=80 chars): def test_add_stoploss_on_exchange(mocker, default_conf_usdt, limit_order, is_...

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_add_stoploss_on_exchange
- test_handle_stoploss_on_exchange
- test_handle_stoploss_on_exchange_emergency
- test_handle_stoploss_on_exchange_partial
- test_handle_stoploss_on_exchange_partial_cancel_here
- test_handle_sle_cancel_cant_recreate
- test_create_stoploss_order_invalid_order
- test_create_stoploss_order_insufficient_funds
- test_handle_stoploss_on_exchange_trailing
- test_handle_stoploss_on_exchange_trailing_error
- test_stoploss_on_exchange_price_rounding
- test_handle_stoploss_on_exchange_custom_stop
- fetch_stoploss_order_mock
- test_execute_trade_exit_down_stoploss_on_exchange_dry_run
- test_execute_trade_exit_sloe_cancel_exception
- test_execute_trade_exit_with_stoploss_on_exchange
- test_may_execute_trade_exit_after_stoploss_on_exchange_hit
```

--------------------------------------------------------------------------------

---[FILE: test_worker.py]---
Location: freqtrade-develop/tests/freqtradebot/test_worker.py
Signals: N/A
Excerpt (<=80 chars):  def test_worker_state(mocker, default_conf, markets) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_worker_state
- test_worker_running
- test_worker_paused
- test_worker_stopped
- test_worker_lifecycle
- test_throttle
- throttled_func
- test_throttle_sleep_time
- test_throttle_with_assets
- test_worker_heartbeat_running
- test_worker_heartbeat_stopped
```

--------------------------------------------------------------------------------

---[FILE: test_candletype.py]---
Location: freqtrade-develop/tests/leverage/test_candletype.py
Signals: N/A
Excerpt (<=80 chars): def test_CandleType_from_string(candle_type, expected):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_CandleType_from_string
- test_CandleType_get_default
```

--------------------------------------------------------------------------------

---[FILE: test_interest.py]---
Location: freqtrade-develop/tests/leverage/test_interest.py
Signals: N/A
Excerpt (<=80 chars): def test_interest(exchange, interest_rate, hours, expected):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_interest
- test_interest_exception
```

--------------------------------------------------------------------------------

---[FILE: test_update_liquidation_price.py]---
Location: freqtrade-develop/tests/leverage/test_update_liquidation_price.py
Signals: N/A
Excerpt (<=80 chars): def test_update_liquidation_prices(mocker, margin_mode, dry_run):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_update_liquidation_prices
```

--------------------------------------------------------------------------------

---[FILE: conftest.py]---
Location: freqtrade-develop/tests/optimize/conftest.py
Signals: N/A
Excerpt (<=80 chars): def hyperopt_conf(default_conf):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- hyperopt_conf
- backtesting_cleanup
- hyperopt
- hyperopt_results
```

--------------------------------------------------------------------------------

---[FILE: test_backtesting.py]---
Location: freqtrade-develop/tests/optimize/test_backtesting.py
Signals: N/A
Excerpt (<=80 chars):  def trim_dictlist(dict_list, num):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- trim_dictlist
- load_data_test
- _make_backtest_conf
- _trend
- _trend_alternate
- test_setup_optimize_configuration_without_arguments
- test_setup_bt_configuration_with_arguments
- test_setup_optimize_configuration_stake_amount
- test_start
- test_backtesting_init
- test_backtesting_init_no_timeframe
- test_data_with_fee
- test_data_to_dataframe_bt
- test_get_pair_precision_bt
- test_backtest_abort
- test_backtesting_start
- get_timerange
- test_backtesting_start_no_data
```

--------------------------------------------------------------------------------

---[FILE: test_backtesting_adjust_position.py]---
Location: freqtrade-develop/tests/optimize/test_backtesting_adjust_position.py
Signals: N/A
Excerpt (<=80 chars):  def test_backtest_position_adjustment(default_conf, fee, mocker, testdatadir...

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_backtest_position_adjustment
- test_backtest_position_adjustment_detailed
```

--------------------------------------------------------------------------------

---[FILE: test_backtest_detail.py]---
Location: freqtrade-develop/tests/optimize/test_backtest_detail.py
Signals: N/A
Excerpt (<=80 chars): def test_backtest_results(default_conf, mocker, caplog, data: BTContainer) ->...

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_backtest_results
```

--------------------------------------------------------------------------------

---[FILE: test_hyperopt.py]---
Location: freqtrade-develop/tests/optimize/test_hyperopt.py
Signals: N/A
Excerpt (<=80 chars):  def generate_result_metrics():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generate_result_metrics
- test_setup_hyperopt_configuration_without_arguments
- test_setup_hyperopt_configuration_with_arguments
- test_setup_hyperopt_configuration_stake_amount
- test_setup_hyperopt_early_stop_setup
- test_start_not_installed
- test_start_no_data
- test_start_filelock
- test_log_results_if_loss_improves
- test_no_log_if_loss_does_not_improve
- test_roi_table_generation
- test_params_no_optimize_details
- test_start_calls_optimizer
- test_hyperopt_format_results
- test_populate_indicators
- test_generate_optimizer
- test_clean_hyperopt
- test_print_json_spaces_all
```

--------------------------------------------------------------------------------

---[FILE: test_hyperoptloss.py]---
Location: freqtrade-develop/tests/optimize/test_hyperoptloss.py
Signals: N/A
Excerpt (<=80 chars):  def test_hyperoptlossresolver_noname(default_conf):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_hyperoptlossresolver_noname
- test_hyperoptlossresolver
- test_hyperoptlossresolver_wrongname
- test_loss_calculation_prefer_correct_trade_count
- test_loss_calculation_prefer_shorter_trades
- test_loss_calculation_has_limited_profit
- test_loss_functions_better_profits
```

--------------------------------------------------------------------------------

---[FILE: test_hyperopt_tools.py]---
Location: freqtrade-develop/tests/optimize/test_hyperopt_tools.py
Signals: N/A
Excerpt (<=80 chars): def create_results() -> list[dict]:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- create_results
- test_save_results_saves_epochs
- test_load_previous_results2
- test_has_space
- test_show_epoch_details
- test__pprint_dict
- test_get_strategy_filename
- test_export_params
- test_try_export_params
- test_params_print
- test_hyperopt_serializer
```

--------------------------------------------------------------------------------

---[FILE: test_lookahead_analysis.py]---
Location: freqtrade-develop/tests/optimize/test_lookahead_analysis.py
Signals: N/A
Excerpt (<=80 chars): def lookahead_conf(default_conf_usdt, tmp_path):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- lookahead_conf
- test_start_lookahead_analysis
- test_lookahead_helper_invalid_config
- test_lookahead_helper_no_strategy_defined
- test_lookahead_helper_start
- test_lookahead_helper_start__caption_based_on_indicators
- test_lookahead_helper_text_table_lookahead_analysis_instances
- test_lookahead_helper_text_table_lookahead_analysis_instances__caption
- test_lookahead_helper_export_to_csv
- test_initialize_single_lookahead_analysis
- test_biased_strategy
- test_config_overrides
```

--------------------------------------------------------------------------------

---[FILE: test_optimize_reports.py]---
Location: freqtrade-develop/tests/optimize/test_optimize_reports.py
Signals: N/A
Excerpt (<=80 chars):  def _backup_file(file: Path, copy_file: bool = False) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- _backup_file
- test_text_table_bt_results
- test_generate_backtest_stats
- test_store_backtest_results
- test_store_backtest_results_real
- test_write_read_backtest_candles
- test_generate_pair_metrics
- test_generate_daily_stats
- test_generate_trading_stats
- test_calc_streak
- test_text_table_exit_reason
- test_generate_sell_reason_stats
- test_text_table_strategy
- test_generate_periodic_breakdown_stats
- test__get_resample_from_period
- test_show_sorted_pairlist
```

--------------------------------------------------------------------------------

---[FILE: test_recursive_analysis.py]---
Location: freqtrade-develop/tests/optimize/test_recursive_analysis.py
Signals: N/A
Excerpt (<=80 chars): def recursive_conf(default_conf_usdt, tmp_path):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- recursive_conf
- test_start_recursive_analysis
- test_recursive_helper_no_strategy_defined
- test_recursive_helper_start
- test_recursive_helper_text_table_recursive_analysis_instances
- test_initialize_single_recursive_analysis
- test_recursive_biased_strategy
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: freqtrade-develop/tests/optimize/__init__.py
Signals: N/A
Excerpt (<=80 chars):  class BTrade(NamedTuple):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BTrade
- BTContainer
- _get_frame_time_from_offset
- _build_backtest_dataframe
```

--------------------------------------------------------------------------------

---[FILE: test_db_context.py]---
Location: freqtrade-develop/tests/persistence/test_db_context.py
Signals: N/A
Excerpt (<=80 chars): def test_FtNoDBContext(timeframe):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_FtNoDBContext
```

--------------------------------------------------------------------------------

---[FILE: test_key_value_store.py]---
Location: freqtrade-develop/tests/persistence/test_key_value_store.py
Signals: N/A
Excerpt (<=80 chars): def test_key_value_store(time_machine):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_key_value_store
- test_set_startup_time
```

--------------------------------------------------------------------------------

---[FILE: test_migrations.py]---
Location: freqtrade-develop/tests/persistence/test_migrations.py
Signals: SQLAlchemy
Excerpt (<=80 chars):  def test_init_create_session(default_conf):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_init_create_session
- test_init_custom_db_url
- test_init_invalid_db_url
- test_init_prod_db
- test_init_dryrun_db
- test_migrate
- test_migrate_too_old
- test_migrate_get_last_sequence_ids
- test_migrate_set_sequence_ids
- test_migrate_pairlocks
- test_create_table_compiles
```

--------------------------------------------------------------------------------

---[FILE: test_persistence.py]---
Location: freqtrade-develop/tests/persistence/test_persistence.py
Signals: SQLAlchemy
Excerpt (<=80 chars): def test_enter_exit_side(fee, is_short):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_enter_exit_side
- test_set_stop_loss_liquidation
- test_interest
- test_borrowed
- test_update_limit_order
- test_update_market_order
- test_calc_open_close_trade_price
- test_trade_close
- test_calc_close_trade_price_exception
- test_update_open_order
- test_update_invalid_order
- test_calc_open_trade_value
- test_calc_close_trade_price
- test_calc_profit
- test_adjust_stop_loss
- test_adjust_stop_loss_short
- test_adjust_min_max_rates
- test_get_open
```

--------------------------------------------------------------------------------

---[FILE: test_trade_custom_data.py]---
Location: freqtrade-develop/tests/persistence/test_trade_custom_data.py
Signals: N/A
Excerpt (<=80 chars): def test_trade_custom_data(fee, use_db):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_trade_custom_data
- test_trade_custom_data_strategy_compat
- custom_exit
- test_trade_custom_data_strategy_backtest_compat
- fun
```

--------------------------------------------------------------------------------

---[FILE: test_trade_fromjson.py]---
Location: freqtrade-develop/tests/persistence/test_trade_fromjson.py
Signals: N/A
Excerpt (<=80 chars): def test_trade_fromjson():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_trade_fromjson
- test_trade_serialize_load_back
- test_trade_fromjson_backtesting
```

--------------------------------------------------------------------------------

---[FILE: test_pairlist.py]---
Location: freqtrade-develop/tests/plugins/test_pairlist.py
Signals: N/A
Excerpt (<=80 chars): def whitelist_conf(default_conf):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- whitelist_conf
- whitelist_conf_2
- whitelist_conf_agefilter
- static_pl_conf
- test_log_cached
- test_load_pairlist_noexist
- test_load_pairlist_verify_multi
- test_refresh_market_pair_not_in_whitelist
- test_refresh_static_pairlist
- test_refresh_static_pairlist_noexist
- test_invalid_blacklist
- test_remove_logs_for_pairs_already_in_blacklist
- test_refresh_pairlist_dynamic
- test_refresh_pairlist_dynamic_2
- test_VolumePairList_refresh_empty
- test_VolumePairList_whitelist_gen
- test_VolumePairList_range
- test_PrecisionFilter_error
```

--------------------------------------------------------------------------------

---[FILE: test_pairlocks.py]---
Location: freqtrade-develop/tests/plugins/test_pairlocks.py
Signals: N/A
Excerpt (<=80 chars): def test_PairLocks(use_db):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_PairLocks
- test_PairLocks_getlongestlock
- test_PairLocks_reason
```

--------------------------------------------------------------------------------

---[FILE: test_percentchangepairlist.py]---
Location: freqtrade-develop/tests/plugins/test_percentchangepairlist.py
Signals: N/A
Excerpt (<=80 chars): def rpl_config(default_conf):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- rpl_config
- test_volume_change_pair_list_init_exchange_support
- test_volume_change_pair_list_init_wrong_refresh_period
- test_volume_change_pair_list_init_wrong_lookback_period
- test_volume_change_pair_list_init_wrong_config
- test_gen_pairlist_with_valid_change_pair_list_config
- test_filter_pairlist_with_empty_ticker
- test_filter_pairlist_with_max_value_set
- test_gen_pairlist_from_tickers
- _validate_pair
```

--------------------------------------------------------------------------------

---[FILE: test_protections.py]---
Location: freqtrade-develop/tests/plugins/test_protections.py
Signals: N/A
Excerpt (<=80 chars):  def generate_mock_trade(

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generate_mock_trade
- test_protectionmanager
- test_validate_protections
- test_protections_init
- test_stoploss_guard
- test_stoploss_guard_perpair
- test_CooldownPeriod
- test_CooldownPeriod_unlock_at
- test_LowProfitPairs
- test_MaxDrawdown
- test_protection_manager_desc
```

--------------------------------------------------------------------------------

---[FILE: test_remotepairlist.py]---
Location: freqtrade-develop/tests/plugins/test_remotepairlist.py
Signals: N/A
Excerpt (<=80 chars): def rpl_config(default_conf):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- rpl_config
- test_gen_pairlist_with_local_file
- test_fetch_pairlist_mock_response_html
- test_fetch_pairlist_timeout_keep_last_pairlist
- test_remote_pairlist_init_no_pairlist_url
- test_remote_pairlist_init_no_number_assets
- test_fetch_pairlist_mock_response_valid
- test_remote_pairlist_init_wrong_mode
- test_remote_pairlist_init_wrong_proc_mode
- test_remote_pairlist_blacklist
- test_remote_pairlist_whitelist
```

--------------------------------------------------------------------------------

---[FILE: test_fiat_convert.py]---
Location: freqtrade-develop/tests/rpc/test_fiat_convert.py
Signals: N/A
Excerpt (<=80 chars):  def test_fiat_convert_is_singleton():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_fiat_convert_is_singleton
- test_fiat_convert_is_supported
- test_fiat_convert_find_price
- test_fiat_convert_unsupported_crypto
- test_fiat_convert_get_price
- test_fiat_convert_same_currencies
- test_fiat_convert_two_FIAT
- test_loadcryptomap
- test_fiat_init_network_exception
- test_fiat_convert_without_network
- test_fiat_too_many_requests_response
- test_fiat_multiple_coins
- test_fiat_invalid_response
- test_convert_amount
- test_FtCoinGeckoApi
```

--------------------------------------------------------------------------------

---[FILE: test_rpc.py]---
Location: freqtrade-develop/tests/rpc/test_rpc.py
Signals: SQLAlchemy
Excerpt (<=80 chars):  def test_rpc_trade_status(default_conf, ticker, fee, mocker) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_rpc_trade_status
- test_rpc_status_table
- test__rpc_timeunit_profit
- test_rpc_trade_history
- test_rpc_delete_trade
- test_rpc_trade_statistics
- test_rpc_balance_handle_error
- test_rpc_balance_handle
- test_rpc_start
- test_rpc_stop
- test_rpc_pause
- test_rpc_force_exit
- test_performance_handle
- test_enter_tag_performance_handle
- test_enter_tag_performance_handle_2
- test_exit_reason_performance_handle
- test_exit_reason_performance_handle_2
- test_mix_tag_performance_handle
```

--------------------------------------------------------------------------------

---[FILE: test_rpc_apiserver.py]---
Location: freqtrade-develop/tests/rpc/test_rpc_apiserver.py
Signals: FastAPI, SQLAlchemy
Excerpt (<=80 chars): def botclient(default_conf, mocker):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- botclient
- client_post
- client_patch
- client_get
- client_delete
- assert_response
- test_api_not_found
- test_api_ui_fallback
- test_api_ui_version
- test_api_auth
- test_api_ws_auth
- url
- test_api_unauthorized
- test_api_token_login
- test_api_token_refresh
- test_api_stop_workflow
- test_api__init__
- test_api_UvicornServer
```

--------------------------------------------------------------------------------

---[FILE: test_rpc_emc.py]---
Location: freqtrade-develop/tests/rpc/test_rpc_emc.py
Signals: N/A
Excerpt (<=80 chars): def patched_emc(default_conf, mocker):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- patched_emc
- test_emc_start
- test_emc_shutdown
- test_emc_init
- test_emc_handle_producer_message
- TestChannel
- change_running
```

--------------------------------------------------------------------------------

---[FILE: test_rpc_manager.py]---
Location: freqtrade-develop/tests/rpc/test_rpc_manager.py
Signals: N/A
Excerpt (<=80 chars):  def test__init__(mocker, default_conf) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test__init__
- test_init_telegram_disabled
- test_init_telegram_enabled
- test_cleanup_telegram_disabled
- test_cleanup_telegram_enabled
- test_send_msg_telegram_disabled
- test_send_msg_telegram_error
- test_process_msg_queue
- test_send_msg_telegram_enabled
- test_init_webhook_disabled
- test_init_webhook_enabled
- test_send_msg_webhook_CustomMessagetype
- test_startupmessages_telegram_enabled
- test_init_apiserver_disabled
- test_init_apiserver_enabled
```

--------------------------------------------------------------------------------

---[FILE: test_rpc_telegram.py]---
Location: freqtrade-develop/tests/rpc/test_rpc_telegram.py
Signals: SQLAlchemy
Excerpt (<=80 chars): def mock_exchange_loop(mocker):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mock_exchange_loop
- default_conf
- update
- patch_eventloop_threading
- thread_fuck
- DummyCls
- __init__
- _init
- get_telegram_testobject
- test_telegram__init__
- test_telegram_init
- test_send_msg_enter_notification
- test_send_msg_enter_cancel_notification
- test_send_msg_protection_notification
- test_send_msg_entry_fill_notification
- test_send_msg_exit_notification
- test_send_msg_exit_fill_notification
- test_send_msg_status_notification
```

--------------------------------------------------------------------------------

---[FILE: test_rpc_webhook.py]---
Location: freqtrade-develop/tests/rpc/test_rpc_webhook.py
Signals: N/A
Excerpt (<=80 chars):  def get_webhook_dict() -> dict:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- get_webhook_dict
- test__init__
- test_send_msg_webhook
- test_exception_send_msg
- test__send_msg
- test__send_msg_with_json_format
- test__send_msg_with_raw_format
- test_send_msg_discord
- test_nested_payload_format
```

--------------------------------------------------------------------------------

---[FILE: test_default_strategy.py]---
Location: freqtrade-develop/tests/strategy/test_default_strategy.py
Signals: N/A
Excerpt (<=80 chars):  def test_strategy_test_v3_structure():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_strategy_test_v3_structure
- test_strategy_test_v3
```

--------------------------------------------------------------------------------

---[FILE: test_interface.py]---
Location: freqtrade-develop/tests/strategy/test_interface.py
Signals: N/A
Excerpt (<=80 chars):  def test_returns_latest_signal(ohlcv_history):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_returns_latest_signal
- test_analyze_pair_empty
- test_get_signal_empty
- test_get_signal_exception_valueerror
- test_get_signal_old_dataframe
- test_get_signal_no_sell_column
- test_ignore_expired_candle
- test_assert_df_raise
- test_assert_df
- test_advise_all_indicators
- test_freqai_not_initialized
- test_advise_all_indicators_copy
- test_min_roi_reached
- test_min_roi_reached2
- test_min_roi_reached3
- test_min_roi_reached_custom_roi
- custom_roi
- test_ft_stoploss_reached
```

--------------------------------------------------------------------------------

---[FILE: test_strategy_helpers.py]---
Location: freqtrade-develop/tests/strategy/test_strategy_helpers.py
Signals: N/A
Excerpt (<=80 chars):  def test_merge_informative_pair():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_merge_informative_pair
- test_merge_informative_pair_weekly
- test_merge_informative_pair_monthly
- test_merge_informative_pair_no_overlap
- test_merge_informative_pair_same
- test_merge_informative_pair_lower
- test_merge_informative_pair_empty
- test_merge_informative_pair_suffix
- test_merge_informative_pair_suffix_append_timeframe
- test_stoploss_from_open
- test_stoploss_from_open_leverage
- test_stoploss_from_absolute
- test_informative_decorator
- test_historic_ohlcv
```

--------------------------------------------------------------------------------

---[FILE: test_strategy_loading.py]---
Location: freqtrade-develop/tests/strategy/test_strategy_loading.py
Signals: N/A
Excerpt (<=80 chars):  def test_search_strategy():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_search_strategy
- test_search_all_strategies_no_failed
- test_search_all_strategies_with_failed
- test_load_strategy
- test_load_strategy_base64
- test_load_strategy_invalid_directory
- test_load_strategy_skip_other_files
- test_load_not_found_strategy
- test_load_strategy_noname
- test_strategy_pre_v3
- test_strategy_can_short
- test_strategy_override_minimal_roi
- test_strategy_override_stoploss
- test_strategy_override_max_open_trades
- test_strategy_override_trailing_stop
- test_strategy_override_trailing_stop_positive
- test_strategy_override_timeframe
- test_strategy_override_process_only_new_candles
```

--------------------------------------------------------------------------------

---[FILE: test_strategy_parameters.py]---
Location: freqtrade-develop/tests/strategy/test_strategy_parameters.py
Signals: N/A
Excerpt (<=80 chars):  def test_hyperopt_int_parameter():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_hyperopt_int_parameter
- test_hyperopt_real_parameter
- test_hyperopt_decimal_parameter
- test_hyperopt_categorical_parameter
```

--------------------------------------------------------------------------------

---[FILE: test_strategy_safe_wrapper.py]---
Location: freqtrade-develop/tests/strategy/test_strategy_safe_wrapper.py
Signals: N/A
Excerpt (<=80 chars): def test_strategy_safe_wrapper_error(caplog, error):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- test_strategy_safe_wrapper_error
- failing_method
- test_strategy_safe_wrapper
- working_method
- test_strategy_safe_wrapper_trade_copy
```

--------------------------------------------------------------------------------

---[FILE: failing_strategy.py]---
Location: freqtrade-develop/tests/strategy/strats/failing_strategy.py
Signals: N/A
Excerpt (<=80 chars):  class TestStrategyLegacyV1(IStrategy):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestStrategyLegacyV1
```

--------------------------------------------------------------------------------

---[FILE: freqai_rl_test_strat.py]---
Location: freqtrade-develop/tests/strategy/strats/freqai_rl_test_strat.py
Signals: N/A
Excerpt (<=80 chars):  class freqai_rl_test_strat(IStrategy):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- freqai_rl_test_strat
- feature_engineering_expand_all
- feature_engineering_expand_basic
- feature_engineering_standard
- set_freqai_targets
- populate_indicators
- populate_entry_trend
- populate_exit_trend
```

--------------------------------------------------------------------------------

---[FILE: freqai_test_classifier.py]---
Location: freqtrade-develop/tests/strategy/strats/freqai_test_classifier.py
Signals: N/A
Excerpt (<=80 chars):  class freqai_test_classifier(IStrategy):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- freqai_test_classifier
- informative_pairs
- feature_engineering_expand_all
- feature_engineering_expand_basic
- feature_engineering_standard
- set_freqai_targets
- populate_indicators
- populate_entry_trend
- populate_exit_trend
```

--------------------------------------------------------------------------------

---[FILE: freqai_test_multimodel_classifier_strat.py]---
Location: freqtrade-develop/tests/strategy/strats/freqai_test_multimodel_classifier_strat.py
Signals: N/A
Excerpt (<=80 chars):  class freqai_test_multimodel_classifier_strat(IStrategy):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- freqai_test_multimodel_classifier_strat
- feature_engineering_expand_all
- feature_engineering_expand_basic
- feature_engineering_standard
- set_freqai_targets
- populate_indicators
- populate_entry_trend
- populate_exit_trend
```

--------------------------------------------------------------------------------

---[FILE: freqai_test_multimodel_strat.py]---
Location: freqtrade-develop/tests/strategy/strats/freqai_test_multimodel_strat.py
Signals: N/A
Excerpt (<=80 chars):  class freqai_test_multimodel_strat(IStrategy):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- freqai_test_multimodel_strat
- feature_engineering_expand_all
- feature_engineering_expand_basic
- feature_engineering_standard
- set_freqai_targets
- populate_indicators
- populate_entry_trend
- populate_exit_trend
```

--------------------------------------------------------------------------------

---[FILE: freqai_test_strat.py]---
Location: freqtrade-develop/tests/strategy/strats/freqai_test_strat.py
Signals: N/A
Excerpt (<=80 chars):  class freqai_test_strat(IStrategy):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- freqai_test_strat
- feature_engineering_expand_all
- feature_engineering_expand_basic
- feature_engineering_standard
- set_freqai_targets
- populate_indicators
- populate_entry_trend
- populate_exit_trend
```

--------------------------------------------------------------------------------

---[FILE: hyperoptable_strategy.py]---
Location: freqtrade-develop/tests/strategy/strats/hyperoptable_strategy.py
Signals: N/A
Excerpt (<=80 chars):  class HyperoptableStrategy(StrategyTestV3):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HyperoptableStrategy
- protections
- bot_loop_start
- bot_start
- populate_entry_trend
- populate_exit_trend
```

--------------------------------------------------------------------------------

---[FILE: hyperoptable_strategy_v2.py]---
Location: freqtrade-develop/tests/strategy/strats/hyperoptable_strategy_v2.py
Signals: N/A
Excerpt (<=80 chars):  class HyperoptableStrategyV2(StrategyTestV2):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HyperoptableStrategyV2
- protections
- bot_loop_start
- bot_start
```

--------------------------------------------------------------------------------

---[FILE: informative_decorator_strategy.py]---
Location: freqtrade-develop/tests/strategy/strats/informative_decorator_strategy.py
Signals: N/A
Excerpt (<=80 chars):  class InformativeDecoratorTest(IStrategy):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InformativeDecoratorTest
- informative_pairs
- populate_buy_trend
- populate_sell_trend
- populate_indicators_1h
- populate_indicators_neo_1h
- populate_indicators_base_1h
- populate_indicators_eth_btc_1h
- populate_indicators_btc_1h_2
- populate_indicators_eth_30m
- populate_indicators
```

--------------------------------------------------------------------------------

---[FILE: strategy_test_v2.py]---
Location: freqtrade-develop/tests/strategy/strats/strategy_test_v2.py
Signals: N/A
Excerpt (<=80 chars):  class StrategyTestV2(IStrategy):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StrategyTestV2
- populate_indicators
- populate_buy_trend
- populate_sell_trend
```

--------------------------------------------------------------------------------

---[FILE: strategy_test_v3.py]---
Location: freqtrade-develop/tests/strategy/strats/strategy_test_v3.py
Signals: N/A
Excerpt (<=80 chars):  class StrategyTestV3(IStrategy):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StrategyTestV3
- protections
- bot_start
- informative_pairs
- populate_indicators
- populate_entry_trend
- populate_exit_trend
- leverage
- adjust_trade_position
- StrategyTestV3Futures
```

--------------------------------------------------------------------------------

---[FILE: strategy_test_v3_custom_entry_price.py]---
Location: freqtrade-develop/tests/strategy/strats/strategy_test_v3_custom_entry_price.py
Signals: N/A
Excerpt (<=80 chars):  class StrategyTestV3CustomEntryPrice(StrategyTestV3):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StrategyTestV3CustomEntryPrice
- populate_indicators
- populate_entry_trend
- populate_exit_trend
- custom_entry_price
```

--------------------------------------------------------------------------------

---[FILE: strategy_test_v3_recursive_issue.py]---
Location: freqtrade-develop/tests/strategy/strats/strategy_test_v3_recursive_issue.py
Signals: N/A
Excerpt (<=80 chars):  class strategy_test_v3_recursive_issue(IStrategy):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- strategy_test_v3_recursive_issue
- populate_indicators
- populate_entry_trend
- populate_exit_trend
```

--------------------------------------------------------------------------------

````
