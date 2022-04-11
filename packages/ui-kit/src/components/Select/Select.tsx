import { FC, ReactNode, useState } from "react";
import clsx from "clsx";
import { Combobox } from "@headlessui/react";
import { nanoid } from "nanoid";

import styles from "./Select.module.css";
import { ChevronDownIcon } from "../icons";

interface Option {
  label: string | ReactNode;
  before?: string | ReactNode;
  id?: string;
  [key: string]: unknown;
}

export interface SelectProps {
  options: Option[];
  selected: Option;
  error?: boolean;
  disabled?: boolean;
  className?: {
    container?: string;
    triggerBefore?: string;
    trigger?: string;
    triggerArrow?: string;
    options?: string;
    optionBefore?: string;
    option?: string;
  };
  onChange?: (option: Option) => void;
}

export const Select: FC<SelectProps> = ({
  selected,
  options,
  error,
  disabled,
  className,
  onChange,
}) => {
  return (
    <div className={clsx(styles.container, className?.container)}>
      <Combobox value={selected} onChange={onChange as any}>
        <Combobox.Button
          className={clsx(
            styles.trigger,
            {
              [styles["trigger-error"]]: error,
              [styles["trigger-disabled"]]: disabled,
            },
            className?.trigger
          )}>
          {({ open }) => {
            return (
              <>
                {selected?.before && (
                  <div
                    className={clsx(
                      styles["trigger-before"],
                      className?.triggerBefore
                    )}>
                    {selected?.before}
                  </div>
                )}
                {selected?.label}
                {!disabled && (
                  <span
                    className={clsx(
                      styles["arrow-container"],
                      {
                        [styles["arrow-container-open"]]: open,
                      },
                      className?.triggerArrow
                    )}>
                    <ChevronDownIcon />
                  </span>
                )}
              </>
            );
          }}
        </Combobox.Button>
        {!disabled && (
          <Combobox.Options className={clsx(styles.options)}>
            {options.map((option) => (
              <Combobox.Option
                key={option?.id || nanoid()}
                value={option}
                className={clsx(styles.option, className?.option)}>
                {option?.before && (
                  <div
                    className={clsx(
                      styles["option-before"],
                      className?.optionBefore
                    )}>
                    {option?.before}
                  </div>
                )}
                {option.label}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </Combobox>
    </div>
  );
};