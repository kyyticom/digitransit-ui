import PropTypes from 'prop-types';
import React from 'react';
import Autosuggest from 'react-autosuggest';
import Icon from './WidgetIcon';
import SuggestionItem from './WidgetSuggestionItem';
import { getLabel } from '../util/suggestionUtils';
import { executeWidgetSearch } from '../util/searchUtils';
import styles from '../../sass/_widget.scss';

const autoSuggestTheme = {
  container: styles['react-autosuggest__container'],
  containerOpen: styles['react-autosuggest__container--open'],
  input: styles['react-autosuggest__input'],
  inputOpen: styles['react-autosuggest__input--open'],
  inputFocused: styles['react-autosuggest__input--focused'],
  suggestionsContainer: styles['react-autosuggest__suggestions-container'],
  suggestionsContainerOpen:
    styles['react-autosuggest__suggestions-container--open'],
  suggestionsList: styles['react-autosuggest__suggestions-list'],
  suggestion: styles['react-autosuggest__suggestion'],
  suggestionFirst: styles['react-autosuggest__suggestion--first'],
  suggestionHighlighted: styles['react-autosuggest__suggestion--highlighted'],
  sectionContainer: styles['react-autosuggest__section-container'],
  sectionContainerFirst: styles['react-autosuggest__section-container--first'],
  sectionTitle: styles['react-autosuggest__section-title'],
};

class WidgetAutoSuggest extends React.Component {
  static propTypes = {
    isFocused: PropTypes.func,
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    config: PropTypes.object.isRequired,
  };

  static defaultProps = {
    isFocused: () => {},
  };

  constructor() {
    super();
    this.state = {
      value: '',
      suggestions: [],
      editing: false,
    };
  }

  onChange = (event, { newValue, method }) => {
    const newState = {
      value: newValue,
    };

    if (!this.state.editing) {
      newState.editing = true;
      this.setState(newState, () => this.fetchFunction({ value: newValue }));
    } else if (method !== 'enter' || this.state.valid) {
      // test above drops unnecessary update
      // when user hits enter but search is unfinished
      this.setState(newState);
    }
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  getSuggestionValue = suggestion => {
    const value = getLabel(suggestion.properties);
    this.props.onChange(this.props.id, value, suggestion.geometry.coordinates);
    return value;
  };

  clearButton = () => {
    const img = this.state.value ? 'icon-icon_close' : 'icon-icon_search';
    return (
      <button
        className={styles['clear-input']}
        onClick={this.clearInput}
        aria-label="clearboom"
      >
        <Icon img={img} />
      </button>
    );
  };

  inputClicked = inputValue => {
    if (!this.state.editing) {
      this.props.isFocused(true);
      const newState = {
        editing: true,
        // reset at start, just in case we missed something
        pendingSelection: null,
      };
      // DT-3263: added stateKeyDown
      const stateKeyDown = {
        editing: true,
        pendingSelection: null,
        value: inputValue,
      };

      if (!this.state.suggestions.length) {
        // DT-3263: added if-else statement
        if (typeof inputValue === 'object' || !inputValue) {
          this.setState(newState, () =>
            this.fetchFunction({ value: this.state.value }),
          );
        } else {
          this.setState(stateKeyDown, () =>
            this.fetchFunction({ value: inputValue }),
          );
        }
      } else {
        this.setState(newState);
      }
    }
  };

  renderItem = item => (
    <SuggestionItem
      doNotShowLinkToStop="false"
      ref={item.name}
      item={item}
      loading={!this.state.valid}
    />
  );

  // DT-3263 starts
  // eslint-disable-next-line consistent-return
  keyDown = event => {
    const keyCode = event.keyCode || event.which;
    if (this.state.editing) {
      return this.inputClicked();
    }

    if ((keyCode === 13 || keyCode === 40) && this.state.value === '') {
      return this.clearInput();
    }

    if (keyCode === 40 && this.state.value !== '') {
      const newState = {
        editing: true,
        value: this.state.value,
      };
      // must update suggestions
      this.setState(newState, () =>
        this.fetchFunction({ value: this.state.value }),
      );
    }
  };

  checkPendingSelection = () => {
    // accept after all ongoing searches have finished

    if (this.state.pendingSelection && this.state.valid) {
      // finish the selection by picking first = best match
      this.setState(
        {
          pendingSelection: null,
          editing: false,
        },
        () => {
          if (this.state.suggestions.length) {
            this.input.blur();
          }
        },
      );
    }
  };

  storeInputReference = autosuggest => {
    if (autosuggest !== null) {
      this.input = autosuggest.input;
    }
  };

  fetchFunction = ({ value }) =>
    this.setState({ valid: false }, () => {
      executeWidgetSearch(
        {
          input: value,
          config: this.props.config,
        },
        searchResult => {
          if (searchResult == null) {
            return;
          }

          const suggestions = (searchResult.results || []).map(suggestion => {
            return suggestion;
          });

          if (
            value === this.state.value ||
            value === this.state.pendingSelection
          ) {
            this.setState(
              {
                valid: true,
                suggestions,
              },
              () => this.checkPendingSelection(),
            );
          }
        },
      );
    });

  clearInput = () => {
    const newState = {
      editing: true,
      value: '',
    };
    // must update suggestions
    this.setState(newState, () => this.fetchFunction({ value: '' }));
    this.props.isFocused(true);
    this.input.focus();
  };

  render() {
    const { value, suggestions } = this.state;
    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: this.props.placeholder,
      value,
      onChange: this.onChange,
      onBlur: this.onBlur,
      onKeyDown: this.keyDown,
      className: `${styles['react-autosuggest__input']} ${
        styles.widgetlocation
      }`,
    };

    return (
      <div>
        <Autosuggest
          id={this.props.id}
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.fetchFunction}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderItem}
          inputProps={inputProps}
          focusInputOnSuggestionClick={false}
          shouldRenderSuggestions={() => this.state.editing}
          highlightFirstSuggestion
          renderInputComponent={p => (
            <>
              <input
                aria-label={this.props.id.concat(' ').concat('arial')}
                id={this.props.id}
                onClick={this.inputClicked}
                onKeyDown={this.keyDown}
                {...p}
              />
              <span className={styles['sr-only']} role="alert">
                6
              </span>
              {this.clearButton()}
            </>
          )}
          onSuggestionSelected={this.onSelected}
          ref={this.storeInputReference}
          theme={autoSuggestTheme}
        />
      </div>
    );
  }
}
export default WidgetAutoSuggest;
