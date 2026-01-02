---
source_txt: fullstack_samples/freqtrade-develop
converted_utc: 2025-12-18T10:36:38Z
part: 3
parts_total: 6
---

# FULLSTACK CODE DATABASE SAMPLES freqtrade-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 3 of 6)

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

---[FILE: hyperopt_loss_sharpe_daily.py]---
Location: freqtrade-develop/freqtrade/optimize/hyperopt_loss/hyperopt_loss_sharpe_daily.py
Signals: N/A
Excerpt (<=80 chars):  class SharpeHyperOptLossDaily(IHyperOptLoss):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SharpeHyperOptLossDaily
- hyperopt_loss_function
```

--------------------------------------------------------------------------------

---[FILE: hyperopt_loss_short_trade_dur.py]---
Location: freqtrade-develop/freqtrade/optimize/hyperopt_loss/hyperopt_loss_short_trade_dur.py
Signals: N/A
Excerpt (<=80 chars):  class ShortTradeDurHyperOptLoss(IHyperOptLoss):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ShortTradeDurHyperOptLoss
- hyperopt_loss_function
- DefaultHyperOptLoss
```

--------------------------------------------------------------------------------

---[FILE: hyperopt_loss_sortino.py]---
Location: freqtrade-develop/freqtrade/optimize/hyperopt_loss/hyperopt_loss_sortino.py
Signals: N/A
Excerpt (<=80 chars):  class SortinoHyperOptLoss(IHyperOptLoss):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SortinoHyperOptLoss
- hyperopt_loss_function
```

--------------------------------------------------------------------------------

---[FILE: hyperopt_loss_sortino_daily.py]---
Location: freqtrade-develop/freqtrade/optimize/hyperopt_loss/hyperopt_loss_sortino_daily.py
Signals: N/A
Excerpt (<=80 chars):  class SortinoHyperOptLossDaily(IHyperOptLoss):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SortinoHyperOptLossDaily
- hyperopt_loss_function
```

--------------------------------------------------------------------------------

---[FILE: bt_output.py]---
Location: freqtrade-develop/freqtrade/optimize/optimize_reports/bt_output.py
Signals: N/A
Excerpt (<=80 chars):  def _get_line_floatfmt(stake_currency: str) -> list[str]:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- _get_line_floatfmt
- _get_line_header
- generate_wins_draws_losses
- text_table_bt_results
- text_table_tags
- text_table_periodic_breakdown
- text_table_strategy
- text_table_add_metrics
- _show_tag_subresults
- show_backtest_result
- show_backtest_results
- show_sorted_pairlist
```

--------------------------------------------------------------------------------

---[FILE: bt_storage.py]---
Location: freqtrade-develop/freqtrade/optimize/optimize_reports/bt_storage.py
Signals: N/A
Excerpt (<=80 chars):  def file_dump_joblib(file_obj: BytesIO, data: Any, log: bool = True) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- file_dump_joblib
- _generate_filename
- store_backtest_results
```

--------------------------------------------------------------------------------

---[FILE: optimize_reports.py]---
Location: freqtrade-develop/freqtrade/optimize/optimize_reports/optimize_reports.py
Signals: N/A
Excerpt (<=80 chars):  def generate_trade_signal_candles(

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generate_trade_signal_candles
- generate_rejected_signals
- _generate_result_line
- calculate_trade_volume
- generate_pair_metrics
- generate_tag_metrics
- generate_strategy_comparison
- _get_resample_from_period
- _calculate_stats_for_period
- generate_periodic_breakdown_stats
- generate_all_periodic_breakdown_stats
- calc_streak
- generate_trading_stats
- generate_daily_stats
- generate_strategy_stats
- generate_backtest_stats
```

--------------------------------------------------------------------------------

---[FILE: decimalspace.py]---
Location: freqtrade-develop/freqtrade/optimize/space/decimalspace.py
Signals: N/A
Excerpt (<=80 chars):  class SKDecimal(FloatDistribution):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SKDecimal
- __init__
```

--------------------------------------------------------------------------------

---[FILE: optunaspaces.py]---
Location: freqtrade-develop/freqtrade/optimize/space/optunaspaces.py
Signals: N/A
Excerpt (<=80 chars):  class DimensionProtocol(Protocol):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DimensionProtocol
- ft_CategoricalDistribution
- __init__
- __repr__
- ft_IntDistribution
- ft_FloatDistribution
```

--------------------------------------------------------------------------------

---[FILE: base.py]---
Location: freqtrade-develop/freqtrade/persistence/base.py
Signals: SQLAlchemy
Excerpt (<=80 chars):  class ModelBase(DeclarativeBase):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ModelBase
```

--------------------------------------------------------------------------------

---[FILE: custom_data.py]---
Location: freqtrade-develop/freqtrade/persistence/custom_data.py
Signals: SQLAlchemy
Excerpt (<=80 chars):  class _CustomData(ModelBase):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- _CustomData
- __repr__
- query_cd
- CustomDataWrapper
- _convert_custom_data
- reset_custom_data
- delete_custom_data
- get_custom_data
- set_custom_data
```

--------------------------------------------------------------------------------

---[FILE: key_value_store.py]---
Location: freqtrade-develop/freqtrade/persistence/key_value_store.py
Signals: SQLAlchemy
Excerpt (<=80 chars):  class ValueTypesEnum(str, Enum):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ValueTypesEnum
- _KeyValueStoreModel
- KeyValueStore
- store_value
- delete_value
- get_value
- get_string_value
- get_datetime_value
- get_float_value
- get_int_value
- set_startup_time
```

--------------------------------------------------------------------------------

---[FILE: migrations.py]---
Location: freqtrade-develop/freqtrade/persistence/migrations.py
Signals: SQLAlchemy
Excerpt (<=80 chars):  def get_table_names_for_table(inspector, tabletype: str) -> list[str]:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- get_table_names_for_table
- has_column
- get_column_def
- get_backup_name
- get_last_sequence_ids
- set_sequence_ids
- drop_index_on_table
- migrate_trades_and_orders_table
- drop_orders_table
- migrate_orders_table
- migrate_pairlocks_table
- set_sqlite_to_wal
- fix_old_dry_orders
- fix_wrong_max_stake_amount
- check_migrate
```

--------------------------------------------------------------------------------

---[FILE: models.py]---
Location: freqtrade-develop/freqtrade/persistence/models.py
Signals: FastAPI, SQLAlchemy
Excerpt (<=80 chars):  def get_request_or_thread_id() -> str | None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- get_request_or_thread_id
- init_db
- custom_data_rpc_wrapper
- wrapper
```

--------------------------------------------------------------------------------

---[FILE: pairlock.py]---
Location: freqtrade-develop/freqtrade/persistence/pairlock.py
Signals: SQLAlchemy
Excerpt (<=80 chars):  class PairLock(ModelBase):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PairLock
- __repr__
- query_pair_locks
- get_all_locks
- to_json
```

--------------------------------------------------------------------------------

---[FILE: pairlock_middleware.py]---
Location: freqtrade-develop/freqtrade/persistence/pairlock_middleware.py
Signals: SQLAlchemy
Excerpt (<=80 chars):  class PairLocks:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PairLocks
- reset_locks
- lock_pair
- get_pair_locks
- get_pair_longest_lock
- unlock_pair
- unlock_reason
- is_global_lock
- is_pair_locked
- get_all_locks
```

--------------------------------------------------------------------------------

---[FILE: trade_model.py]---
Location: freqtrade-develop/freqtrade/persistence/trade_model.py
Signals: SQLAlchemy
Excerpt (<=80 chars): class ProfitStruct:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProfitStruct
- Order
- order_date_utc
- order_filled_utc
- safe_amount
- safe_placement_price
- safe_price
- safe_filled
- safe_cost
- safe_remaining
- safe_fee_base
- safe_amount_after_fee
- trade
- stake_amount
- stake_amount_filled
- __repr__
- update_from_ccxt_object
- to_ccxt_object
```

--------------------------------------------------------------------------------

---[FILE: usedb_context.py]---
Location: freqtrade-develop/freqtrade/persistence/usedb_context.py
Signals: N/A
Excerpt (<=80 chars):  def disable_database_use(timeframe: str) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- disable_database_use
- enable_database_use
- FtNoDBContext
- __init__
- __enter__
- __exit__
```

--------------------------------------------------------------------------------

---[FILE: plotting.py]---
Location: freqtrade-develop/freqtrade/plot/plotting.py
Signals: N/A
Excerpt (<=80 chars):  def init_plotscript(config, markets: list, startup_candles: int = 0):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- init_plotscript
- add_indicators
- add_profit
- add_max_drawdown
- add_underwater
- add_parallelism
- plot_trades
- create_plotconfig
- plot_area
- add_areas
- create_scatter
- generate_candlestick_graph
- generate_profit_graph
- generate_plot_filename
- store_plot_file
- load_and_plot_trades
- plot_profit
```

--------------------------------------------------------------------------------

---[FILE: pairlistmanager.py]---
Location: freqtrade-develop/freqtrade/plugins/pairlistmanager.py
Signals: N/A
Excerpt (<=80 chars):  class PairListManager(LoggingMixin):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PairListManager
- __init__
- _check_backtest
- whitelist
- blacklist
- expanded_blacklist
- name_list
- short_desc
- _get_cached_tickers
- refresh_pairlist
- verify_blacklist
- verify_whitelist
- create_pair_list
```

--------------------------------------------------------------------------------

---[FILE: protectionmanager.py]---
Location: freqtrade-develop/freqtrade/plugins/protectionmanager.py
Signals: N/A
Excerpt (<=80 chars):  class ProtectionManager:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProtectionManager
- __init__
- name_list
- short_desc
- global_stop
- stop_per_pair
- validate_protections
```

--------------------------------------------------------------------------------

---[FILE: AgeFilter.py]---
Location: freqtrade-develop/freqtrade/plugins/pairlist/AgeFilter.py
Signals: N/A
Excerpt (<=80 chars):  class AgeFilter(IPairList):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AgeFilter
- __init__
- needstickers
- short_desc
- description
- available_parameters
- filter_pairlist
- _validate_pair_loc
```

--------------------------------------------------------------------------------

---[FILE: DelistFilter.py]---
Location: freqtrade-develop/freqtrade/plugins/pairlist/DelistFilter.py
Signals: N/A
Excerpt (<=80 chars):  class DelistFilter(IPairList):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DelistFilter
- __init__
- needstickers
- short_desc
- description
- available_parameters
- _validate_pair
```

--------------------------------------------------------------------------------

---[FILE: FullTradesFilter.py]---
Location: freqtrade-develop/freqtrade/plugins/pairlist/FullTradesFilter.py
Signals: N/A
Excerpt (<=80 chars):  class FullTradesFilter(IPairList):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FullTradesFilter
- needstickers
- short_desc
- description
- filter_pairlist
```

--------------------------------------------------------------------------------

---[FILE: IPairList.py]---
Location: freqtrade-develop/freqtrade/plugins/pairlist/IPairList.py
Signals: N/A
Excerpt (<=80 chars):  class __PairlistParameterBase(TypedDict):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- __PairlistParameterBase
- __NumberPairlistParameter
- __StringPairlistParameter
- __OptionPairlistParameter
- __ListPairListParamenter
- __BoolPairlistParameter
- SupportsBacktesting
- IPairList
- __init__
- name
- needstickers
- description
- available_parameters
- refresh_period_parameter
- short_desc
- _validate_pair
- gen_pairlist
- filter_pairlist
```

--------------------------------------------------------------------------------

---[FILE: MarketCapPairList.py]---
Location: freqtrade-develop/freqtrade/plugins/pairlist/MarketCapPairList.py
Signals: N/A
Excerpt (<=80 chars):  class MarketCapPairList(IPairList):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MarketCapPairList
- __init__
- needstickers
- short_desc
- description
- available_parameters
- get_markets_exchange
- gen_pairlist
- resolve_marketcap_pair
- filter_pairlist
```

--------------------------------------------------------------------------------

---[FILE: OffsetFilter.py]---
Location: freqtrade-develop/freqtrade/plugins/pairlist/OffsetFilter.py
Signals: N/A
Excerpt (<=80 chars):  class OffsetFilter(IPairList):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OffsetFilter
- __init__
- needstickers
- short_desc
- description
- available_parameters
- filter_pairlist
```

--------------------------------------------------------------------------------

---[FILE: pairlist_helpers.py]---
Location: freqtrade-develop/freqtrade/plugins/pairlist/pairlist_helpers.py
Signals: N/A
Excerpt (<=80 chars):  def expand_pairlist(

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- expand_pairlist
- dynamic_expand_pairlist
```

--------------------------------------------------------------------------------

---[FILE: PercentChangePairList.py]---
Location: freqtrade-develop/freqtrade/plugins/pairlist/PercentChangePairList.py
Signals: N/A
Excerpt (<=80 chars):  class SymbolWithPercentage(TypedDict):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SymbolWithPercentage
- PercentChangePairList
- __init__
- needstickers
- short_desc
- description
- available_parameters
- gen_pairlist
- filter_pairlist
- fetch_candles_for_lookback_period
- fetch_percent_change_from_lookback_period
- fetch_percent_change_from_tickers
- _validate_pair
```

--------------------------------------------------------------------------------

---[FILE: PerformanceFilter.py]---
Location: freqtrade-develop/freqtrade/plugins/pairlist/PerformanceFilter.py
Signals: N/A
Excerpt (<=80 chars):  class PerformanceFilter(IPairList):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PerformanceFilter
- __init__
- needstickers
- short_desc
- description
- available_parameters
- filter_pairlist
```

--------------------------------------------------------------------------------

---[FILE: PrecisionFilter.py]---
Location: freqtrade-develop/freqtrade/plugins/pairlist/PrecisionFilter.py
Signals: N/A
Excerpt (<=80 chars):  class PrecisionFilter(IPairList):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PrecisionFilter
- __init__
- needstickers
- short_desc
- description
- _validate_pair
```

--------------------------------------------------------------------------------

---[FILE: PriceFilter.py]---
Location: freqtrade-develop/freqtrade/plugins/pairlist/PriceFilter.py
Signals: N/A
Excerpt (<=80 chars):  class PriceFilter(IPairList):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PriceFilter
- __init__
- needstickers
- short_desc
- description
- available_parameters
- _validate_pair
```

--------------------------------------------------------------------------------

---[FILE: ProducerPairList.py]---
Location: freqtrade-develop/freqtrade/plugins/pairlist/ProducerPairList.py
Signals: N/A
Excerpt (<=80 chars):  class ProducerPairList(IPairList):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProducerPairList
- __init__
- needstickers
- short_desc
- description
- available_parameters
- _filter_pairlist
- gen_pairlist
- filter_pairlist
```

--------------------------------------------------------------------------------

---[FILE: rangestabilityfilter.py]---
Location: freqtrade-develop/freqtrade/plugins/pairlist/rangestabilityfilter.py
Signals: N/A
Excerpt (<=80 chars):  class RangeStabilityFilter(IPairList):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RangeStabilityFilter
- __init__
- needstickers
- short_desc
- description
- available_parameters
- filter_pairlist
- _calculate_rate_of_change
- _validate_pair_loc
```

--------------------------------------------------------------------------------

---[FILE: RemotePairList.py]---
Location: freqtrade-develop/freqtrade/plugins/pairlist/RemotePairList.py
Signals: N/A
Excerpt (<=80 chars):  class RemotePairList(IPairList):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemotePairList
- __init__
- needstickers
- short_desc
- description
- available_parameters
- process_json
- return_last_pairlist
- fetch_pairlist
- _handle_error
- gen_pairlist
- save_pairlist
- filter_pairlist
```

--------------------------------------------------------------------------------

---[FILE: ShuffleFilter.py]---
Location: freqtrade-develop/freqtrade/plugins/pairlist/ShuffleFilter.py
Signals: N/A
Excerpt (<=80 chars):  class ShuffleFilter(IPairList):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ShuffleFilter
- __init__
- needstickers
- short_desc
- description
- available_parameters
- filter_pairlist
```

--------------------------------------------------------------------------------

---[FILE: SpreadFilter.py]---
Location: freqtrade-develop/freqtrade/plugins/pairlist/SpreadFilter.py
Signals: N/A
Excerpt (<=80 chars):  class SpreadFilter(IPairList):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SpreadFilter
- __init__
- needstickers
- short_desc
- description
- available_parameters
- _validate_pair
```

--------------------------------------------------------------------------------

---[FILE: StaticPairList.py]---
Location: freqtrade-develop/freqtrade/plugins/pairlist/StaticPairList.py
Signals: N/A
Excerpt (<=80 chars):  class StaticPairList(IPairList):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StaticPairList
- __init__
- needstickers
- short_desc
- description
- available_parameters
- gen_pairlist
- filter_pairlist
```

--------------------------------------------------------------------------------

---[FILE: VolatilityFilter.py]---
Location: freqtrade-develop/freqtrade/plugins/pairlist/VolatilityFilter.py
Signals: N/A
Excerpt (<=80 chars):  class VolatilityFilter(IPairList):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VolatilityFilter
- __init__
- needstickers
- short_desc
- description
- available_parameters
- filter_pairlist
- _calculate_volatility
- _validate_pair_loc
```

--------------------------------------------------------------------------------

---[FILE: VolumePairList.py]---
Location: freqtrade-develop/freqtrade/plugins/pairlist/VolumePairList.py
Signals: N/A
Excerpt (<=80 chars):  class VolumePairList(IPairList):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VolumePairList
- __init__
- needstickers
- _validate_keys
- short_desc
- description
- available_parameters
- gen_pairlist
- filter_pairlist
```

--------------------------------------------------------------------------------

---[FILE: cooldown_period.py]---
Location: freqtrade-develop/freqtrade/plugins/protections/cooldown_period.py
Signals: N/A
Excerpt (<=80 chars):  class CooldownPeriod(IProtection):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CooldownPeriod
- _reason
- short_desc
- _cooldown_period
- global_stop
- stop_per_pair
```

--------------------------------------------------------------------------------

---[FILE: iprotection.py]---
Location: freqtrade-develop/freqtrade/plugins/protections/iprotection.py
Signals: N/A
Excerpt (<=80 chars): class ProtectionReturn:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProtectionReturn
- IProtection
- __init__
- name
- stop_duration_str
- lookback_period_str
- unlock_reason_time_element
- short_desc
- global_stop
- stop_per_pair
- calculate_lock_end
```

--------------------------------------------------------------------------------

---[FILE: low_profit_pairs.py]---
Location: freqtrade-develop/freqtrade/plugins/protections/low_profit_pairs.py
Signals: N/A
Excerpt (<=80 chars):  class LowProfitPairs(IProtection):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LowProfitPairs
- __init__
- short_desc
- _reason
- _low_profit
- global_stop
- stop_per_pair
```

--------------------------------------------------------------------------------

---[FILE: max_drawdown_protection.py]---
Location: freqtrade-develop/freqtrade/plugins/protections/max_drawdown_protection.py
Signals: N/A
Excerpt (<=80 chars):  class MaxDrawdown(IProtection):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MaxDrawdown
- __init__
- short_desc
- _reason
- _max_drawdown
- global_stop
- stop_per_pair
```

--------------------------------------------------------------------------------

---[FILE: stoploss_guard.py]---
Location: freqtrade-develop/freqtrade/plugins/protections/stoploss_guard.py
Signals: N/A
Excerpt (<=80 chars):  class StoplossGuard(IProtection):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StoplossGuard
- __init__
- short_desc
- _reason
- _stoploss_guard
- global_stop
- stop_per_pair
```

--------------------------------------------------------------------------------

---[FILE: exchange_resolver.py]---
Location: freqtrade-develop/freqtrade/resolvers/exchange_resolver.py
Signals: N/A
Excerpt (<=80 chars):  class ExchangeResolver(IResolver):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExchangeResolver
- load_exchange
- _load_exchange
- search_all_objects
```

--------------------------------------------------------------------------------

---[FILE: freqaimodel_resolver.py]---
Location: freqtrade-develop/freqtrade/resolvers/freqaimodel_resolver.py
Signals: N/A
Excerpt (<=80 chars):  class FreqaiModelResolver(IResolver):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FreqaiModelResolver
- load_freqaimodel
```

--------------------------------------------------------------------------------

---[FILE: hyperopt_resolver.py]---
Location: freqtrade-develop/freqtrade/resolvers/hyperopt_resolver.py
Signals: N/A
Excerpt (<=80 chars):  class HyperOptLossResolver(IResolver):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HyperOptLossResolver
- load_hyperoptloss
```

--------------------------------------------------------------------------------

---[FILE: iresolver.py]---
Location: freqtrade-develop/freqtrade/resolvers/iresolver.py
Signals: N/A
Excerpt (<=80 chars):  class PathModifier:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PathModifier
- __init__
- __enter__
- __exit__
- IResolver
- build_search_paths
- _get_valid_object
- is_valid_class
- _search_object
- _load_object
- load_object
- search_all_objects
- _build_rel_location
- _search_all_objects
```

--------------------------------------------------------------------------------

---[FILE: pairlist_resolver.py]---
Location: freqtrade-develop/freqtrade/resolvers/pairlist_resolver.py
Signals: N/A
Excerpt (<=80 chars):  class PairListResolver(IResolver):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PairListResolver
- load_pairlist
```

--------------------------------------------------------------------------------

---[FILE: protection_resolver.py]---
Location: freqtrade-develop/freqtrade/resolvers/protection_resolver.py
Signals: N/A
Excerpt (<=80 chars):  class ProtectionResolver(IResolver):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProtectionResolver
- load_protection
```

--------------------------------------------------------------------------------

---[FILE: strategy_resolver.py]---
Location: freqtrade-develop/freqtrade/resolvers/strategy_resolver.py
Signals: N/A
Excerpt (<=80 chars):  class StrategyResolver(IResolver):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StrategyResolver
- load_strategy
- _override_attribute_helper
- _normalize_attributes
- _strategy_sanity_validations
- validate_strategy
- _load_strategy
- warn_deprecated_setting
- check_override
```

--------------------------------------------------------------------------------

---[FILE: discord.py]---
Location: freqtrade-develop/freqtrade/rpc/discord.py
Signals: N/A
Excerpt (<=80 chars):  class Discord(Webhook):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Discord
- __init__
- cleanup
- send_msg
```

--------------------------------------------------------------------------------

---[FILE: external_message_consumer.py]---
Location: freqtrade-develop/freqtrade/rpc/external_message_consumer.py
Signals: Pydantic
Excerpt (<=80 chars):  class Producer(TypedDict):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Producer
- schema_to_dict
- ExternalMessageConsumer
- __init__
- start
- shutdown
- send_producer_request
- handle_producer_message
- _consume_whitelist_message
- _consume_analyzed_df_message
```

--------------------------------------------------------------------------------

---[FILE: fiat_convert.py]---
Location: freqtrade-develop/freqtrade/rpc/fiat_convert.py
Signals: N/A
Excerpt (<=80 chars):  class CryptoToFiatConverter(LoggingMixin):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CryptoToFiatConverter
- __new__
- __init__
- _load_cryptomap
- _get_gecko_id
- convert_amount
- get_price
- _is_supported_fiat
- _find_price
```

--------------------------------------------------------------------------------

---[FILE: rpc.py]---
Location: freqtrade-develop/freqtrade/rpc/rpc.py
Signals: SQLAlchemy
Excerpt (<=80 chars):  class RPCException(Exception):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RPCException
- __init__
- __str__
- __json__
- RPCHandler
- name
- cleanup
- send_msg
- RPC
- _rpc_show_config
- _rpc_trade_status
- _rpc_status_table
- _rpc_timeunit_profit
- time_offset
- _rpc_trade_history
- _rpc_stats
```

--------------------------------------------------------------------------------

---[FILE: rpc_manager.py]---
Location: freqtrade-develop/freqtrade/rpc/rpc_manager.py
Signals: N/A
Excerpt (<=80 chars):  class RPCManager:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RPCManager
- __init__
- cleanup
- send_msg
- process_msg_queue
- startup_messages
```

--------------------------------------------------------------------------------

---[FILE: rpc_types.py]---
Location: freqtrade-develop/freqtrade/rpc/rpc_types.py
Signals: N/A
Excerpt (<=80 chars):  class RPCSendMsgBase(TypedDict):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RPCSendMsgBase
- RPCStatusMsg
- RPCStrategyMsg
- RPCProtectionMsg
- RPCWhitelistMsg
- __RPCEntryExitMsgBase
- RPCEntryMsg
- RPCCancelMsg
- RPCExitMsg
- RPCExitCancelMsg
- _AnalyzedDFData
- RPCAnalyzedDFMsg
- RPCNewCandleMsg
```

--------------------------------------------------------------------------------

---[FILE: telegram.py]---
Location: freqtrade-develop/freqtrade/rpc/telegram.py
Signals: N/A
Excerpt (<=80 chars):  def safe_async_db(func: Callable[..., Any]):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- safe_async_db
- wrapper
- TimeunitMappings
- authorized_only
- Telegram
- __init__
- _start_thread
- _init_keyboard
- _init_telegram_app
- _init
- cleanup
- _exchange_from_msg
- _add_analyzed_candle
- _format_entry_msg
- _format_exit_msg
- __format_profit_fiat
- compose_message
- _message_loudness
```

--------------------------------------------------------------------------------

---[FILE: webhook.py]---
Location: freqtrade-develop/freqtrade/rpc/webhook.py
Signals: N/A
Excerpt (<=80 chars):  class Webhook(RPCHandler):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Webhook
- __init__
- cleanup
- _get_value_dict
- recursive_format
- send_msg
- _send_msg
```

--------------------------------------------------------------------------------

---[FILE: api_auth.py]---
Location: freqtrade-develop/freqtrade/rpc/api_server/api_auth.py
Signals: FastAPI
Excerpt (<=80 chars):  def verify_auth(api_config, username: str, password: str):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- verify_auth
- get_user_from_token
- create_token
- http_basic_or_jwt_token
- token_login
- token_refresh
```

--------------------------------------------------------------------------------

---[FILE: api_background_tasks.py]---
Location: freqtrade-develop/freqtrade/rpc/api_server/api_background_tasks.py
Signals: FastAPI
Excerpt (<=80 chars): def background_job_list():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- background_job_list
- background_job
```

--------------------------------------------------------------------------------

---[FILE: api_backtest.py]---
Location: freqtrade-develop/freqtrade/rpc/api_server/api_backtest.py
Signals: FastAPI, Pydantic
Excerpt (<=80 chars):  def __run_backtest_bg(btconfig: Config):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- __run_backtest_bg
- api_get_backtest
- api_delete_backtest
- api_backtest_abort
- api_backtest_history
- api_backtest_history_result
- api_delete_backtest_history_entry
- api_update_backtest_history_entry
- api_get_backtest_market_change
```

--------------------------------------------------------------------------------

---[FILE: api_download_data.py]---
Location: freqtrade-develop/freqtrade/rpc/api_server/api_download_data.py
Signals: FastAPI
Excerpt (<=80 chars):  def __run_download(job_id: str, config_loc: Config):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- __run_download
- ft_callback
- pairlists_evaluate
```

--------------------------------------------------------------------------------

---[FILE: api_pairlists.py]---
Location: freqtrade-develop/freqtrade/rpc/api_server/api_pairlists.py
Signals: FastAPI
Excerpt (<=80 chars): def list_pairlists(config=Depends(get_config)):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- list_pairlists
- __run_pairlist
- pairlists_evaluate
- handleExchangePayload
- pairlists_evaluate_get
```

--------------------------------------------------------------------------------

---[FILE: api_pair_history.py]---
Location: freqtrade-develop/freqtrade/rpc/api_server/api_pair_history.py
Signals: FastAPI
Excerpt (<=80 chars): def pair_history(

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pair_history
- pair_history_filtered
```

--------------------------------------------------------------------------------

---[FILE: api_schemas.py]---
Location: freqtrade-develop/freqtrade/rpc/api_server/api_schemas.py
Signals: Pydantic
Excerpt (<=80 chars):  class ExchangeModePayloadMixin(BaseModel):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExchangeModePayloadMixin
- Ping
- AccessToken
- AccessAndRefreshToken
- Version
- StatusMsg
- BgJobStarted
- BackgroundTaskStatus
- BackgroundTaskResult
- ResultMsg
- Balance
- Balances
- Count
- __BaseStatsModel
- Entry
- Exit
- MixTag
- PerformanceEntry
```

--------------------------------------------------------------------------------

---[FILE: api_v1.py]---
Location: freqtrade-develop/freqtrade/rpc/api_server/api_v1.py
Signals: FastAPI
Excerpt (<=80 chars): def ping():

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ping
- version
- balance
- count
- entries
- exits
- mix_tags
- performance
- profit
- profit_all
- stats
- daily
- weekly
- monthly
- status
- trades
- trade
- trades_delete
```

--------------------------------------------------------------------------------

---[FILE: api_ws.py]---
Location: freqtrade-develop/freqtrade/rpc/api_server/api_ws.py
Signals: FastAPI, Pydantic
Excerpt (<=80 chars): import logging

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: deps.py]---
Location: freqtrade-develop/freqtrade/rpc/api_server/deps.py
Signals: FastAPI
Excerpt (<=80 chars):  def get_rpc_optional() -> RPC | None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- get_rpc_optional
- get_config
- get_api_config
- _generate_exchange_key
- get_exchange
- get_message_stream
- is_webserver_mode
```

--------------------------------------------------------------------------------

---[FILE: uvicorn_threaded.py]---
Location: freqtrade-develop/freqtrade/rpc/api_server/uvicorn_threaded.py
Signals: N/A
Excerpt (<=80 chars):  def asyncio_setup() -> None: # pragma: no cover

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- asyncio_setup
- UvicornServer
- run
- run_in_thread
- cleanup
```

--------------------------------------------------------------------------------

---[FILE: webserver.py]---
Location: freqtrade-develop/freqtrade/rpc/api_server/webserver.py
Signals: FastAPI
Excerpt (<=80 chars):  class FTJSONResponse(JSONResponse):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FTJSONResponse
- render
- ApiServer
- __new__
- __init__
- add_rpc_handler
- cleanup
- shutdown
- send_msg
- handle_rpc_exception
- configure_app
- start_api
```

--------------------------------------------------------------------------------

---[FILE: webserver_bgwork.py]---
Location: freqtrade-develop/freqtrade/rpc/api_server/webserver_bgwork.py
Signals: N/A
Excerpt (<=80 chars):  class ProgressTask(TypedDict):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProgressTask
- JobsContainer
- ApiBG
- get_job_id
```

--------------------------------------------------------------------------------

---[FILE: web_ui.py]---
Location: freqtrade-develop/freqtrade/rpc/api_server/web_ui.py
Signals: FastAPI
Excerpt (<=80 chars): from pathlib import Path

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: ws_schemas.py]---
Location: freqtrade-develop/freqtrade/rpc/api_server/ws_schemas.py
Signals: Pydantic
Excerpt (<=80 chars):  class BaseArbitraryModel(BaseModel):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseArbitraryModel
- WSRequestSchema
- WSMessageSchemaType
- WSMessageSchema
- WSSubscribeRequest
- WSWhitelistRequest
- WSAnalyzedDFRequest
- WSWhitelistMessage
- WSAnalyzedDFMessage
- AnalyzedDFData
- WSErrorMessage
```

--------------------------------------------------------------------------------

---[FILE: channel.py]---
Location: freqtrade-develop/freqtrade/rpc/api_server/ws/channel.py
Signals: FastAPI
Excerpt (<=80 chars):  class WebSocketChannel:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebSocketChannel
- __init__
- __repr__
- raw_websocket
- remote_addr
- avg_send_time
- _calc_send_limit
- is_closed
- set_subscriptions
- subscribed_to
```

--------------------------------------------------------------------------------

---[FILE: message_stream.py]---
Location: freqtrade-develop/freqtrade/rpc/api_server/ws/message_stream.py
Signals: N/A
Excerpt (<=80 chars):  class MessageStream:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MessageStream
- __init__
- publish
```

--------------------------------------------------------------------------------

---[FILE: proxy.py]---
Location: freqtrade-develop/freqtrade/rpc/api_server/ws/proxy.py
Signals: FastAPI
Excerpt (<=80 chars):  class WebSocketProxy:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebSocketProxy
- __init__
- raw_websocket
- remote_addr
```

--------------------------------------------------------------------------------

---[FILE: serializer.py]---
Location: freqtrade-develop/freqtrade/rpc/api_server/ws/serializer.py
Signals: N/A
Excerpt (<=80 chars):  class WebSocketSerializer(ABC):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebSocketSerializer
- __init__
- _serialize
- _deserialize
- HybridJSONWebSocketSerializer
- _json_default
- _json_object_hook
```

--------------------------------------------------------------------------------

---[FILE: ws_types.py]---
Location: freqtrade-develop/freqtrade/rpc/api_server/ws/ws_types.py
Signals: FastAPI
Excerpt (<=80 chars): from typing import Any, TypeVar

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: hyper.py]---
Location: freqtrade-develop/freqtrade/strategy/hyper.py
Signals: N/A
Excerpt (<=80 chars):  class HyperStrategyMixin:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HyperStrategyMixin
- __init__
- enumerate_parameters
- ft_load_params_from_file
- ft_load_hyper_params
- load_params_from_file
- _ft_load_params
- get_no_optimize_params
- detect_all_parameters
```

--------------------------------------------------------------------------------

---[FILE: informative_decorator.py]---
Location: freqtrade-develop/freqtrade/strategy/informative_decorator.py
Signals: N/A
Excerpt (<=80 chars): class InformativeData:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InformativeData
- informative
- populate_indicators_1h
- decorator
- __get_pair_formats
- _format_pair_name
- _create_and_merge_informative_pair
```

--------------------------------------------------------------------------------

---[FILE: interface.py]---
Location: freqtrade-develop/freqtrade/strategy/interface.py
Signals: Pydantic
Excerpt (<=80 chars):  class IStrategy(ABC, HyperStrategyMixin):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IStrategy
- __init__
- load_freqAI_model
- DummyClass
- start
- shutdown
- ft_bot_start
- ft_bot_cleanup
- populate_indicators
- populate_buy_trend
- populate_entry_trend
- populate_sell_trend
- populate_exit_trend
- bot_start
- bot_loop_start
- check_buy_timeout
- check_entry_timeout
- check_sell_timeout
```

--------------------------------------------------------------------------------

---[FILE: parameters.py]---
Location: freqtrade-develop/freqtrade/strategy/parameters.py
Signals: N/A
Excerpt (<=80 chars):  class BaseParameter(ABC):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseParameter
- __init__
- __repr__
- get_space
- can_optimize
- NumericParameter
- IntParameter
- range
- RealParameter
- DecimalParameter
- value
```

--------------------------------------------------------------------------------

````
