import React from "react";
import styles from "./Input.module.css";

const input = (props) => {
  let inputElement = null;
  const inputStyles = [styles.InputElement];

  if (props.invalid && props.shouldValidate && props.touched) {
      inputStyles.push(styles.Invalid);
  } 

  switch (props.elementType) {
    case "input":
      inputElement = (
        <input
          {...props.elementConfig}
          value={props.value}
          className={inputStyles.join(' ')}
          onChange={props.changed}
        />
      );
      break;
    case "textarea":
      inputElement = (
        <textarea
          {...props.elementConfig}
          value={props.value}
          className={inputStyles.join(' ')}
          onChange={props.changed}
        />
      );
      break;
    case "select":
      inputElement = (
        <select
          value={props.value}
          className={inputStyles.join(' ')}
          onChange={props.changed}
        >
          {props.elementConfig.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.displayValue}
            </option>
          ))}
        </select>
      );
      break;
    default:
      inputElement = (
        <input
          {...props.elementConfig}
          value={props.value}
          className={inputStyles.join(' ')}
          onChange={props.changed}
        />
      );
  }

  return (
    <div className={styles.Input}>
      <label className={styles.Label}>{props.label}</label>
      {inputElement}
    </div>
  );
};

export default input;
