---
source_txt: fullstack_samples/freqtrade-develop
converted_utc: 2025-12-18T10:36:38Z
part: 2
parts_total: 6
---

# FULLSTACK CODE DATABASE SAMPLES freqtrade-develop

## Extracted Reusable Patterns (Non-verbatim) (Part 2 of 6)

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

---[FILE: kraken.py]---
Location: freqtrade-develop/freqtrade/exchange/kraken.py
Signals: N/A
Excerpt (<=80 chars):  class Kraken(Exchange):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Kraken
- market_is_tradable
- consolidate_balances
- get_balances
- _set_leverage
- _get_params
- calculate_funding_fees
- _get_trade_pagination_next_value
- _valid_trade_pagination_id
```

--------------------------------------------------------------------------------

---[FILE: kucoin.py]---
Location: freqtrade-develop/freqtrade/exchange/kucoin.py
Signals: N/A
Excerpt (<=80 chars):  class Kucoin(Exchange):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Kucoin
- _get_stop_params
- create_order
```

--------------------------------------------------------------------------------

---[FILE: lbank.py]---
Location: freqtrade-develop/freqtrade/exchange/lbank.py
Signals: N/A
Excerpt (<=80 chars):  class Lbank(Exchange):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Lbank
```

--------------------------------------------------------------------------------

---[FILE: luno.py]---
Location: freqtrade-develop/freqtrade/exchange/luno.py
Signals: N/A
Excerpt (<=80 chars):  class Luno(Exchange):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Luno
```

--------------------------------------------------------------------------------

---[FILE: modetrade.py]---
Location: freqtrade-develop/freqtrade/exchange/modetrade.py
Signals: N/A
Excerpt (<=80 chars):  class Modetrade(Exchange):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Modetrade
```

--------------------------------------------------------------------------------

---[FILE: okx.py]---
Location: freqtrade-develop/freqtrade/exchange/okx.py
Signals: N/A
Excerpt (<=80 chars):  class Okx(Exchange):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Okx
- ohlcv_candle_limit
- additional_exchange_init
- _get_posSide
- _get_params
- __fetch_leverage_already_set
- _lev_prep
- get_max_pair_stake_amount
- _get_stop_params
- _convert_stop_order
- fetch_stoploss_order
- _fetch_stop_order_fallback
- get_order_id_conditional
- cancel_stoploss_order
- _fetch_orders_emulate
- Myokx
- Okxus
```

--------------------------------------------------------------------------------

---[FILE: data_drawer.py]---
Location: freqtrade-develop/freqtrade/freqai/data_drawer.py
Signals: N/A
Excerpt (<=80 chars):  class pair_info(TypedDict):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pair_info
- FreqaiDataDrawer
- __init__
- update_metric_tracker
- collect_metrics
- load_global_metadata_from_disk
- load_drawer_from_disk
- load_metric_tracker_from_disk
- load_historic_predictions_from_disk
- save_historic_predictions_to_disk
- save_metric_tracker_to_disk
- save_drawer_to_disk
- save_global_metadata_to_disk
- np_encoder
- get_pair_dict_info
- set_pair_dict_info
- set_initial_return_values
- append_model_predictions
```

--------------------------------------------------------------------------------

---[FILE: data_kitchen.py]---
Location: freqtrade-develop/freqtrade/freqai/data_kitchen.py
Signals: N/A
Excerpt (<=80 chars):  class FreqaiDataKitchen:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FreqaiDataKitchen
- __init__
- set_paths
- make_train_test_datasets
- filter_features
- build_data_dictionary
- split_timerange
- slice_dataframe
- find_features
- find_labels
- set_weights_higher_recent
- get_predictions_to_append
- append_predictions
- fill_predictions
- create_fulltimerange
- check_if_model_expired
- check_if_new_training_required
- set_new_model_names
```

--------------------------------------------------------------------------------

---[FILE: freqai_interface.py]---
Location: freqtrade-develop/freqtrade/freqai/freqai_interface.py
Signals: N/A
Excerpt (<=80 chars):  class IFreqaiModel(ABC):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IFreqaiModel
- __init__
- __getstate__
- assert_config
- start
- clean_up
- _on_stop
- shutdown
- start_scanning
- _start_scanning
- start_backtesting
- start_live
- build_strategy_return_arrays
- check_if_feature_list_matches_strategy
- define_data_pipeline
- define_label_pipeline
- model_exists
- set_full_path
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: freqtrade-develop/freqtrade/freqai/utils.py
Signals: N/A
Excerpt (<=80 chars):  def download_all_data_for_training(dp: DataProvider, config: Config) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- download_all_data_for_training
- get_required_data_timerange
- plot_feature_importance
- add_feature_trace
- record_params
- get_timerange_backtest_live_models
- get_tb_logger
```

--------------------------------------------------------------------------------

---[FILE: BaseClassifierModel.py]---
Location: freqtrade-develop/freqtrade/freqai/base_models/BaseClassifierModel.py
Signals: N/A
Excerpt (<=80 chars):  class BaseClassifierModel(IFreqaiModel):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseClassifierModel
- train
- predict
```

--------------------------------------------------------------------------------

---[FILE: BasePyTorchClassifier.py]---
Location: freqtrade-develop/freqtrade/freqai/base_models/BasePyTorchClassifier.py
Signals: N/A
Excerpt (<=80 chars):  class BasePyTorchClassifier(BasePyTorchModel):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BasePyTorchClassifier
- set_freqai_targets
- __init__
- predict
- encode_class_names
- assert_valid_class_names
- decode_class_names
- init_class_names_to_index_mapping
- convert_label_column_to_int
- get_class_names
- train
```

--------------------------------------------------------------------------------

---[FILE: BasePyTorchModel.py]---
Location: freqtrade-develop/freqtrade/freqai/base_models/BasePyTorchModel.py
Signals: N/A
Excerpt (<=80 chars):  class BasePyTorchModel(IFreqaiModel, ABC):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BasePyTorchModel
- __init__
- data_convertor
```

--------------------------------------------------------------------------------

---[FILE: BasePyTorchRegressor.py]---
Location: freqtrade-develop/freqtrade/freqai/base_models/BasePyTorchRegressor.py
Signals: N/A
Excerpt (<=80 chars):  class BasePyTorchRegressor(BasePyTorchModel):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BasePyTorchRegressor
- __init__
- predict
- train
```

--------------------------------------------------------------------------------

---[FILE: BaseRegressionModel.py]---
Location: freqtrade-develop/freqtrade/freqai/base_models/BaseRegressionModel.py
Signals: N/A
Excerpt (<=80 chars):  class BaseRegressionModel(IFreqaiModel):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseRegressionModel
- train
- predict
```

--------------------------------------------------------------------------------

---[FILE: FreqaiMultiOutputClassifier.py]---
Location: freqtrade-develop/freqtrade/freqai/base_models/FreqaiMultiOutputClassifier.py
Signals: N/A
Excerpt (<=80 chars):  class FreqaiMultiOutputClassifier(MultiOutputClassifier):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FreqaiMultiOutputClassifier
- fit
- predict_proba
- predict
```

--------------------------------------------------------------------------------

---[FILE: FreqaiMultiOutputRegressor.py]---
Location: freqtrade-develop/freqtrade/freqai/base_models/FreqaiMultiOutputRegressor.py
Signals: N/A
Excerpt (<=80 chars):  class FreqaiMultiOutputRegressor(MultiOutputRegressor):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FreqaiMultiOutputRegressor
- fit
```

--------------------------------------------------------------------------------

---[FILE: CatboostClassifier.py]---
Location: freqtrade-develop/freqtrade/freqai/prediction_models/CatboostClassifier.py
Signals: N/A
Excerpt (<=80 chars):  class CatboostClassifier(BaseClassifierModel):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CatboostClassifier
- fit
```

--------------------------------------------------------------------------------

---[FILE: CatboostClassifierMultiTarget.py]---
Location: freqtrade-develop/freqtrade/freqai/prediction_models/CatboostClassifierMultiTarget.py
Signals: N/A
Excerpt (<=80 chars):  class CatboostClassifierMultiTarget(BaseClassifierModel):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CatboostClassifierMultiTarget
- fit
```

--------------------------------------------------------------------------------

---[FILE: CatboostRegressor.py]---
Location: freqtrade-develop/freqtrade/freqai/prediction_models/CatboostRegressor.py
Signals: N/A
Excerpt (<=80 chars):  class CatboostRegressor(BaseRegressionModel):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CatboostRegressor
- fit
```

--------------------------------------------------------------------------------

---[FILE: CatboostRegressorMultiTarget.py]---
Location: freqtrade-develop/freqtrade/freqai/prediction_models/CatboostRegressorMultiTarget.py
Signals: N/A
Excerpt (<=80 chars):  class CatboostRegressorMultiTarget(BaseRegressionModel):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CatboostRegressorMultiTarget
- fit
```

--------------------------------------------------------------------------------

---[FILE: LightGBMClassifier.py]---
Location: freqtrade-develop/freqtrade/freqai/prediction_models/LightGBMClassifier.py
Signals: N/A
Excerpt (<=80 chars):  class LightGBMClassifier(BaseClassifierModel):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LightGBMClassifier
- fit
```

--------------------------------------------------------------------------------

---[FILE: LightGBMClassifierMultiTarget.py]---
Location: freqtrade-develop/freqtrade/freqai/prediction_models/LightGBMClassifierMultiTarget.py
Signals: N/A
Excerpt (<=80 chars):  class LightGBMClassifierMultiTarget(BaseClassifierModel):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LightGBMClassifierMultiTarget
- fit
```

--------------------------------------------------------------------------------

---[FILE: LightGBMRegressor.py]---
Location: freqtrade-develop/freqtrade/freqai/prediction_models/LightGBMRegressor.py
Signals: N/A
Excerpt (<=80 chars):  class LightGBMRegressor(BaseRegressionModel):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LightGBMRegressor
- fit
```

--------------------------------------------------------------------------------

---[FILE: LightGBMRegressorMultiTarget.py]---
Location: freqtrade-develop/freqtrade/freqai/prediction_models/LightGBMRegressorMultiTarget.py
Signals: N/A
Excerpt (<=80 chars):  class LightGBMRegressorMultiTarget(BaseRegressionModel):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LightGBMRegressorMultiTarget
- fit
```

--------------------------------------------------------------------------------

---[FILE: PyTorchMLPClassifier.py]---
Location: freqtrade-develop/freqtrade/freqai/prediction_models/PyTorchMLPClassifier.py
Signals: N/A
Excerpt (<=80 chars):  class PyTorchMLPClassifier(BasePyTorchClassifier):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PyTorchMLPClassifier
- data_convertor
- __init__
- fit
```

--------------------------------------------------------------------------------

---[FILE: PyTorchMLPRegressor.py]---
Location: freqtrade-develop/freqtrade/freqai/prediction_models/PyTorchMLPRegressor.py
Signals: N/A
Excerpt (<=80 chars):  class PyTorchMLPRegressor(BasePyTorchRegressor):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PyTorchMLPRegressor
- data_convertor
- __init__
- fit
```

--------------------------------------------------------------------------------

---[FILE: PyTorchTransformerRegressor.py]---
Location: freqtrade-develop/freqtrade/freqai/prediction_models/PyTorchTransformerRegressor.py
Signals: N/A
Excerpt (<=80 chars):  class PyTorchTransformerRegressor(BasePyTorchRegressor):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PyTorchTransformerRegressor
- data_convertor
- __init__
- fit
- predict
```

--------------------------------------------------------------------------------

---[FILE: ReinforcementLearner.py]---
Location: freqtrade-develop/freqtrade/freqai/prediction_models/ReinforcementLearner.py
Signals: N/A
Excerpt (<=80 chars):  class ReinforcementLearner(BaseReinforcementLearningModel):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReinforcementLearner
- MyCoolRLModel
- fit
- MyRLEnv
- calculate_reward
```

--------------------------------------------------------------------------------

---[FILE: ReinforcementLearner_multiproc.py]---
Location: freqtrade-develop/freqtrade/freqai/prediction_models/ReinforcementLearner_multiproc.py
Signals: N/A
Excerpt (<=80 chars):  class ReinforcementLearner_multiproc(ReinforcementLearner):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ReinforcementLearner_multiproc
- set_train_and_eval_environments
```

--------------------------------------------------------------------------------

---[FILE: SKLearnRandomForestClassifier.py]---
Location: freqtrade-develop/freqtrade/freqai/prediction_models/SKLearnRandomForestClassifier.py
Signals: N/A
Excerpt (<=80 chars):  class SKLearnRandomForestClassifier(BaseClassifierModel):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SKLearnRandomForestClassifier
- fit
- predict
```

--------------------------------------------------------------------------------

---[FILE: XGBoostClassifier.py]---
Location: freqtrade-develop/freqtrade/freqai/prediction_models/XGBoostClassifier.py
Signals: N/A
Excerpt (<=80 chars):  class XGBoostClassifier(BaseClassifierModel):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- XGBoostClassifier
- fit
- predict
```

--------------------------------------------------------------------------------

---[FILE: XGBoostRegressor.py]---
Location: freqtrade-develop/freqtrade/freqai/prediction_models/XGBoostRegressor.py
Signals: N/A
Excerpt (<=80 chars):  class XGBoostRegressor(BaseRegressionModel):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- XGBoostRegressor
- fit
```

--------------------------------------------------------------------------------

---[FILE: XGBoostRegressorMultiTarget.py]---
Location: freqtrade-develop/freqtrade/freqai/prediction_models/XGBoostRegressorMultiTarget.py
Signals: N/A
Excerpt (<=80 chars):  class XGBoostRegressorMultiTarget(BaseRegressionModel):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- XGBoostRegressorMultiTarget
- fit
```

--------------------------------------------------------------------------------

---[FILE: XGBoostRFClassifier.py]---
Location: freqtrade-develop/freqtrade/freqai/prediction_models/XGBoostRFClassifier.py
Signals: N/A
Excerpt (<=80 chars):  class XGBoostRFClassifier(BaseClassifierModel):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- XGBoostRFClassifier
- fit
- predict
```

--------------------------------------------------------------------------------

---[FILE: XGBoostRFRegressor.py]---
Location: freqtrade-develop/freqtrade/freqai/prediction_models/XGBoostRFRegressor.py
Signals: N/A
Excerpt (<=80 chars):  class XGBoostRFRegressor(BaseRegressionModel):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- XGBoostRFRegressor
- fit
```

--------------------------------------------------------------------------------

---[FILE: Base3ActionRLEnv.py]---
Location: freqtrade-develop/freqtrade/freqai/RL/Base3ActionRLEnv.py
Signals: N/A
Excerpt (<=80 chars):  class Actions(Enum):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Actions
- Base3ActionRLEnv
- __init__
- set_action_space
- step
- is_tradesignal
- _is_valid
```

--------------------------------------------------------------------------------

---[FILE: Base4ActionRLEnv.py]---
Location: freqtrade-develop/freqtrade/freqai/RL/Base4ActionRLEnv.py
Signals: N/A
Excerpt (<=80 chars):  class Actions(Enum):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Actions
- Base4ActionRLEnv
- __init__
- set_action_space
- step
- is_tradesignal
- _is_valid
```

--------------------------------------------------------------------------------

---[FILE: Base5ActionRLEnv.py]---
Location: freqtrade-develop/freqtrade/freqai/RL/Base5ActionRLEnv.py
Signals: N/A
Excerpt (<=80 chars):  class Actions(Enum):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Actions
- Base5ActionRLEnv
- __init__
- set_action_space
- step
- is_tradesignal
- _is_valid
```

--------------------------------------------------------------------------------

---[FILE: BaseEnvironment.py]---
Location: freqtrade-develop/freqtrade/freqai/RL/BaseEnvironment.py
Signals: N/A
Excerpt (<=80 chars):  class BaseActions(Enum):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseActions
- Positions
- opposite
- BaseEnvironment
- __init__
- reset_env
- get_attr
- set_action_space
- action_masks
- seed
- tensorboard_log
- calculate_reward
- reset_tensorboard_log
- reset
- step
- _get_observation
- get_trade_duration
- get_unrealized_profit
```

--------------------------------------------------------------------------------

---[FILE: BaseReinforcementLearningModel.py]---
Location: freqtrade-develop/freqtrade/freqai/RL/BaseReinforcementLearningModel.py
Signals: N/A
Excerpt (<=80 chars):  class BaseReinforcementLearningModel(IFreqaiModel):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseReinforcementLearningModel
- __init__
- unset_outlier_removal
- train
- set_train_and_eval_environments
- pack_env_dict
- fit
- get_state_info
- predict
- rl_model_predict
- _predict
- build_ohlc_price_dataframes
- drop_ohlc_from_df
- load_model_from_disk
- _on_stop
- MyRLEnv
- calculate_reward
- make_env
```

--------------------------------------------------------------------------------

---[FILE: base_tensorboard.py]---
Location: freqtrade-develop/freqtrade/freqai/tensorboard/base_tensorboard.py
Signals: N/A
Excerpt (<=80 chars):  class BaseTensorboardLogger:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseTensorboardLogger
- __init__
- log_scalar
- close
- BaseTensorBoardCallback
- after_iteration
- after_training
```

--------------------------------------------------------------------------------

---[FILE: tensorboard.py]---
Location: freqtrade-develop/freqtrade/freqai/tensorboard/tensorboard.py
Signals: N/A
Excerpt (<=80 chars):  class TensorboardLogger(BaseTensorboardLogger):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TensorboardLogger
- __init__
- log_scalar
- close
- TensorBoardCallback
- after_iteration
- after_training
```

--------------------------------------------------------------------------------

---[FILE: TensorboardCallback.py]---
Location: freqtrade-develop/freqtrade/freqai/tensorboard/TensorboardCallback.py
Signals: N/A
Excerpt (<=80 chars):  class TensorboardCallback(BaseCallback):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TensorboardCallback
- __init__
- _on_training_start
- _on_step
```

--------------------------------------------------------------------------------

---[FILE: datasets.py]---
Location: freqtrade-develop/freqtrade/freqai/torch/datasets.py
Signals: N/A
Excerpt (<=80 chars):  class WindowDataset(torch.utils.data.Dataset):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WindowDataset
- __init__
- __len__
- __getitem__
```

--------------------------------------------------------------------------------

---[FILE: PyTorchDataConvertor.py]---
Location: freqtrade-develop/freqtrade/freqai/torch/PyTorchDataConvertor.py
Signals: N/A
Excerpt (<=80 chars):  class PyTorchDataConvertor(ABC):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PyTorchDataConvertor
- convert_x
- convert_y
- DefaultPyTorchDataConvertor
- __init__
```

--------------------------------------------------------------------------------

---[FILE: PyTorchMLPModel.py]---
Location: freqtrade-develop/freqtrade/freqai/torch/PyTorchMLPModel.py
Signals: N/A
Excerpt (<=80 chars):  class PyTorchMLPModel(nn.Module):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PyTorchMLPModel
- __init__
- forward
- Block
- FeedForward
```

--------------------------------------------------------------------------------

---[FILE: PyTorchModelTrainer.py]---
Location: freqtrade-develop/freqtrade/freqai/torch/PyTorchModelTrainer.py
Signals: N/A
Excerpt (<=80 chars):  class PyTorchModelTrainer(PyTorchTrainerInterface):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PyTorchModelTrainer
- __init__
- fit
- estimate_loss
- create_data_loaders_dictionary
- calc_n_epochs
- save
- load
- load_from_checkpoint
- PyTorchTransformerTrainer
```

--------------------------------------------------------------------------------

---[FILE: PyTorchTrainerInterface.py]---
Location: freqtrade-develop/freqtrade/freqai/torch/PyTorchTrainerInterface.py
Signals: N/A
Excerpt (<=80 chars):  class PyTorchTrainerInterface(ABC):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PyTorchTrainerInterface
- fit
- save
- load
- load_from_checkpoint
```

--------------------------------------------------------------------------------

---[FILE: PyTorchTransformerModel.py]---
Location: freqtrade-develop/freqtrade/freqai/torch/PyTorchTransformerModel.py
Signals: N/A
Excerpt (<=80 chars):  class PyTorchTransformerModel(nn.Module):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PyTorchTransformerModel
- __init__
- forward
- PositionalEncoding
```

--------------------------------------------------------------------------------

---[FILE: backtest_result_type.py]---
Location: freqtrade-develop/freqtrade/ft_types/backtest_result_type.py
Signals: N/A
Excerpt (<=80 chars):  class BacktestMetadataType(TypedDict):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BacktestMetadataType
- BacktestResultType
- get_BacktestResultType_default
- BacktestHistoryEntryType
- BacktestContentTypeIcomplete
- BacktestContentType
```

--------------------------------------------------------------------------------

---[FILE: plot_annotation_type.py]---
Location: freqtrade-develop/freqtrade/ft_types/plot_annotation_type.py
Signals: Pydantic
Excerpt (<=80 chars):  class _BaseAnnotationType(TypedDict, total=False):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- _BaseAnnotationType
- AreaAnnotationType
- LineAnnotationType
```

--------------------------------------------------------------------------------

---[FILE: valid_exchanges_type.py]---
Location: freqtrade-develop/freqtrade/ft_types/valid_exchanges_type.py
Signals: N/A
Excerpt (<=80 chars):  class TradeModeType(TypedDict):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TradeModeType
- ValidExchangesType
```

--------------------------------------------------------------------------------

---[FILE: interest.py]---
Location: freqtrade-develop/freqtrade/leverage/interest.py
Signals: N/A
Excerpt (<=80 chars):  def interest(

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- interest
```

--------------------------------------------------------------------------------

---[FILE: liquidation_price.py]---
Location: freqtrade-develop/freqtrade/leverage/liquidation_price.py
Signals: N/A
Excerpt (<=80 chars):  def update_liquidation_prices(

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- update_liquidation_prices
```

--------------------------------------------------------------------------------

---[FILE: buffering_handler.py]---
Location: freqtrade-develop/freqtrade/loggers/buffering_handler.py
Signals: N/A
Excerpt (<=80 chars):  class FTBufferingHandler(BufferingHandler):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FTBufferingHandler
- flush
```

--------------------------------------------------------------------------------

---[FILE: ft_rich_handler.py]---
Location: freqtrade-develop/freqtrade/loggers/ft_rich_handler.py
Signals: N/A
Excerpt (<=80 chars):  class FtRichHandler(Handler):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FtRichHandler
- __init__
- emit
```

--------------------------------------------------------------------------------

---[FILE: json_formatter.py]---
Location: freqtrade-develop/freqtrade/loggers/json_formatter.py
Signals: N/A
Excerpt (<=80 chars):  class JsonFormatter(logging.Formatter):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JsonFormatter
- __init__
- usesTime
- formatMessage
- formatMessageDict
- format
```

--------------------------------------------------------------------------------

---[FILE: rich_console.py]---
Location: freqtrade-develop/freqtrade/loggers/rich_console.py
Signals: N/A
Excerpt (<=80 chars):  def console_width() -> int | None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- console_width
- get_rich_console
```

--------------------------------------------------------------------------------

---[FILE: set_log_levels.py]---
Location: freqtrade-develop/freqtrade/loggers/set_log_levels.py
Signals: N/A
Excerpt (<=80 chars):  def reduce_verbosity_for_bias_tester() -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- reduce_verbosity_for_bias_tester
- restore_verbosity_for_bias_tester
```

--------------------------------------------------------------------------------

---[FILE: std_err_stream_handler.py]---
Location: freqtrade-develop/freqtrade/loggers/std_err_stream_handler.py
Signals: N/A
Excerpt (<=80 chars):  class FTStdErrStreamHandler(Handler):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FTStdErrStreamHandler
- flush
- emit
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: freqtrade-develop/freqtrade/loggers/__init__.py
Signals: N/A
Excerpt (<=80 chars):  def get_existing_handlers(handlertype):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- get_existing_handlers
- setup_logging_pre
- _set_log_levels
- _add_root_handler
- _add_formatter
- _create_log_config
- setup_logging
```

--------------------------------------------------------------------------------

---[FILE: logging_mixin.py]---
Location: freqtrade-develop/freqtrade/mixins/logging_mixin.py
Signals: N/A
Excerpt (<=80 chars):  class LoggingMixin:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LoggingMixin
- __init__
- log_once
- _log_once
```

--------------------------------------------------------------------------------

---[FILE: backtesting.py]---
Location: freqtrade-develop/freqtrade/optimize/backtesting.py
Signals: N/A
Excerpt (<=80 chars):  class Backtesting:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Backtesting
- __init__
- _validate_pairlists_for_backtesting
- log_once
- set_fee
- cleanup
- init_backtest_detail
- init_backtest
- _set_strategy
- _load_protections
- load_bt_data
- _load_bt_data_detail
- get_pair_precision
- disable_database_use
- reset_backtest
- check_abort
- _get_ohlcv_as_lists
- _get_close_rate
```

--------------------------------------------------------------------------------

---[FILE: backtest_caching.py]---
Location: freqtrade-develop/freqtrade/optimize/backtest_caching.py
Signals: N/A
Excerpt (<=80 chars):  def get_strategy_run_id(strategy) -> str:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- get_strategy_run_id
- get_backtest_metadata_filename
```

--------------------------------------------------------------------------------

---[FILE: bt_progress.py]---
Location: freqtrade-develop/freqtrade/optimize/bt_progress.py
Signals: N/A
Excerpt (<=80 chars):  class BTProgress:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BTProgress
- __init__
- init_step
- set_new_value
- increment
- progress
- action
```

--------------------------------------------------------------------------------

---[FILE: hyperopt_epoch_filters.py]---
Location: freqtrade-develop/freqtrade/optimize/hyperopt_epoch_filters.py
Signals: N/A
Excerpt (<=80 chars):  def hyperopt_filter_epochs(epochs: list, filteroptions: dict, log: bool = Tr...

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- hyperopt_filter_epochs
- _hyperopt_filter_epochs_trade
- _hyperopt_filter_epochs_trade_count
- _hyperopt_filter_epochs_duration
- get_duration_value
- _hyperopt_filter_epochs_profit
- _hyperopt_filter_epochs_objective
```

--------------------------------------------------------------------------------

---[FILE: hyperopt_tools.py]---
Location: freqtrade-develop/freqtrade/optimize/hyperopt_tools.py
Signals: N/A
Excerpt (<=80 chars):  def hyperopt_serializer(x):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- hyperopt_serializer
- HyperoptStateContainer
- set_state
- HyperoptTools
- get_strategy_filename
- export_params
- load_params
- try_export_params
- has_space
- _read_results
- _test_hyperopt_results_exist
- load_filtered_results
- show_epoch_details
- _params_update_for_json
- _params_pretty_print
- _space_params
- _pprint_dict
- is_best_loss
```

--------------------------------------------------------------------------------

---[FILE: base_analysis.py]---
Location: freqtrade-develop/freqtrade/optimize/analysis/base_analysis.py
Signals: N/A
Excerpt (<=80 chars):  class VarHolder:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VarHolder
- BaseAnalysis
- __init__
- dt_to_timestamp
- fill_full_varholder
- start
```

--------------------------------------------------------------------------------

---[FILE: lookahead.py]---
Location: freqtrade-develop/freqtrade/optimize/analysis/lookahead.py
Signals: N/A
Excerpt (<=80 chars):  class Analysis:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Analysis
- __init__
- LookaheadAnalysis
- get_result
- report_signal
- analyze_indicators
- prepare_data
- fill_entry_and_exit_varHolders
- analyze_row
- start
```

--------------------------------------------------------------------------------

---[FILE: lookahead_helpers.py]---
Location: freqtrade-develop/freqtrade/optimize/analysis/lookahead_helpers.py
Signals: N/A
Excerpt (<=80 chars):  class LookaheadAnalysisSubFunctions:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LookaheadAnalysisSubFunctions
- text_table_lookahead_analysis_instances
- export_to_csv
- add_or_update_row
- calculate_config_overrides
- initialize_single_lookahead_analysis
- start
```

--------------------------------------------------------------------------------

---[FILE: recursive.py]---
Location: freqtrade-develop/freqtrade/optimize/analysis/recursive.py
Signals: N/A
Excerpt (<=80 chars):  def is_number(variable):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- is_number
- RecursiveAnalysis
- __init__
- analyze_indicators
- analyze_indicators_lookahead
- prepare_data
- fill_partial_varholder
- fill_partial_varholder_lookahead
- start
```

--------------------------------------------------------------------------------

---[FILE: recursive_helpers.py]---
Location: freqtrade-develop/freqtrade/optimize/analysis/recursive_helpers.py
Signals: N/A
Excerpt (<=80 chars):  class RecursiveAnalysisSubFunctions:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RecursiveAnalysisSubFunctions
- text_table_recursive_analysis_instances
- calculate_config_overrides
- initialize_single_recursive_analysis
- start
```

--------------------------------------------------------------------------------

---[FILE: hyperopt.py]---
Location: freqtrade-develop/freqtrade/optimize/hyperopt/hyperopt.py
Signals: N/A
Excerpt (<=80 chars):  class Hyperopt:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Hyperopt
- __init__
- get_lock_filename
- clean_hyperopt
- _save_result
- print_results
- run_optimizer_parallel
- _set_random_state
- get_optuna_asked_points
- duplicate_optuna_asked_points
- get_asked_points
- evaluate_result
- start
```

--------------------------------------------------------------------------------

---[FILE: hyperopt_auto.py]---
Location: freqtrade-develop/freqtrade/optimize/hyperopt/hyperopt_auto.py
Signals: N/A
Excerpt (<=80 chars):  def _format_exception_message(space: str, ignore_missing_space: bool) -> None:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- _format_exception_message
- HyperOptAuto
- get_available_spaces
- _get_func
- get_indicator_space
- generate_roi_table
- roi_space
- stoploss_space
- generate_trailing_params
- trailing_space
- max_open_trades_space
- generate_estimator
```

--------------------------------------------------------------------------------

---[FILE: hyperopt_interface.py]---
Location: freqtrade-develop/freqtrade/optimize/hyperopt/hyperopt_interface.py
Signals: N/A
Excerpt (<=80 chars):  class IHyperOpt(ABC):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IHyperOpt
- __init__
- generate_estimator
- generate_roi_table
- roi_space
- stoploss_space
- generate_trailing_params
- trailing_space
- max_open_trades_space
- __getstate__
- __setstate__
```

--------------------------------------------------------------------------------

---[FILE: hyperopt_logger.py]---
Location: freqtrade-develop/freqtrade/optimize/hyperopt/hyperopt_logger.py
Signals: N/A
Excerpt (<=80 chars):  def logging_mp_setup(log_queue: Queue, verbosity: int):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- logging_mp_setup
- logging_mp_handle
```

--------------------------------------------------------------------------------

---[FILE: hyperopt_optimizer.py]---
Location: freqtrade-develop/freqtrade/optimize/hyperopt/hyperopt_optimizer.py
Signals: N/A
Excerpt (<=80 chars):  class HyperOptimizer:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HyperOptimizer
- __init__
- _setup_logging_mp_workaround
- handle_mp_logging
- prepare_hyperopt
- get_strategy_name
- hyperopt_pickle_magic
- _get_params_details
- _get_no_optimize_details
- init_spaces
- generate_optimizer_wrapped
- generate_optimizer
- _get_results_dict
- convert_dimensions_to_optuna_space
- get_optimizer
- advise_and_trim
- prepare_hyperopt_data
```

--------------------------------------------------------------------------------

---[FILE: hyperopt_output.py]---
Location: freqtrade-develop/freqtrade/optimize/hyperopt/hyperopt_output.py
Signals: N/A
Excerpt (<=80 chars):  class HyperoptOutput:

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HyperoptOutput
- __init__
- __call__
- __init_table
- print
- add_data
```

--------------------------------------------------------------------------------

---[FILE: hyperopt_loss_calmar.py]---
Location: freqtrade-develop/freqtrade/optimize/hyperopt_loss/hyperopt_loss_calmar.py
Signals: N/A
Excerpt (<=80 chars):  class CalmarHyperOptLoss(IHyperOptLoss):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CalmarHyperOptLoss
- hyperopt_loss_function
```

--------------------------------------------------------------------------------

---[FILE: hyperopt_loss_interface.py]---
Location: freqtrade-develop/freqtrade/optimize/hyperopt_loss/hyperopt_loss_interface.py
Signals: N/A
Excerpt (<=80 chars):  class IHyperOptLoss(ABC):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IHyperOptLoss
- hyperopt_loss_function
```

--------------------------------------------------------------------------------

---[FILE: hyperopt_loss_max_drawdown.py]---
Location: freqtrade-develop/freqtrade/optimize/hyperopt_loss/hyperopt_loss_max_drawdown.py
Signals: N/A
Excerpt (<=80 chars):  class MaxDrawDownHyperOptLoss(IHyperOptLoss):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MaxDrawDownHyperOptLoss
- hyperopt_loss_function
```

--------------------------------------------------------------------------------

---[FILE: hyperopt_loss_max_drawdown_per_pair.py]---
Location: freqtrade-develop/freqtrade/optimize/hyperopt_loss/hyperopt_loss_max_drawdown_per_pair.py
Signals: N/A
Excerpt (<=80 chars):  class MaxDrawDownPerPairHyperOptLoss(IHyperOptLoss):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MaxDrawDownPerPairHyperOptLoss
- hyperopt_loss_function
```

--------------------------------------------------------------------------------

---[FILE: hyperopt_loss_max_drawdown_relative.py]---
Location: freqtrade-develop/freqtrade/optimize/hyperopt_loss/hyperopt_loss_max_drawdown_relative.py
Signals: N/A
Excerpt (<=80 chars):  class MaxDrawDownRelativeHyperOptLoss(IHyperOptLoss):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MaxDrawDownRelativeHyperOptLoss
- hyperopt_loss_function
```

--------------------------------------------------------------------------------

---[FILE: hyperopt_loss_multi_metric.py]---
Location: freqtrade-develop/freqtrade/optimize/hyperopt_loss/hyperopt_loss_multi_metric.py
Signals: N/A
Excerpt (<=80 chars):  class MultiMetricHyperOptLoss(IHyperOptLoss):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MultiMetricHyperOptLoss
- hyperopt_loss_function
```

--------------------------------------------------------------------------------

---[FILE: hyperopt_loss_onlyprofit.py]---
Location: freqtrade-develop/freqtrade/optimize/hyperopt_loss/hyperopt_loss_onlyprofit.py
Signals: N/A
Excerpt (<=80 chars):  class OnlyProfitHyperOptLoss(IHyperOptLoss):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OnlyProfitHyperOptLoss
- hyperopt_loss_function
```

--------------------------------------------------------------------------------

---[FILE: hyperopt_loss_profit_drawdown.py]---
Location: freqtrade-develop/freqtrade/optimize/hyperopt_loss/hyperopt_loss_profit_drawdown.py
Signals: N/A
Excerpt (<=80 chars):  class ProfitDrawDownHyperOptLoss(IHyperOptLoss):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProfitDrawDownHyperOptLoss
- hyperopt_loss_function
```

--------------------------------------------------------------------------------

---[FILE: hyperopt_loss_sharpe.py]---
Location: freqtrade-develop/freqtrade/optimize/hyperopt_loss/hyperopt_loss_sharpe.py
Signals: N/A
Excerpt (<=80 chars):  class SharpeHyperOptLoss(IHyperOptLoss):

```python
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SharpeHyperOptLoss
- hyperopt_loss_function
```

--------------------------------------------------------------------------------

````
