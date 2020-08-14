/// <reference types="react" />
declare module "utils/notUndefined" {
  /**
   * https://github.com/microsoft/TypeScript/issues/20707#issuecomment-351874491
   */
  function notUndefined<T>(x: T | undefined): x is T;
  export default notUndefined;
}
declare module "utils/string/appendClassName" {
  /**
   * Extends className string by additional class names
   *
   * @param {string} baseClass
   * @param {string|Array|false} extendClass
   *
   * @returns {string} result class name string with class names separated by space
   *
   * @example
   * // returns 'b-block b-product__element'
   * appendClassName('b-block', 'b-product__element')
   *
   * @example
   * // returns 'b-block b-product__element b-image'
   * appendClassName('b-block', ['b-product__element', 'b-image'])
   *
   * @example
   * // returns 'b-block'
   * appendClassName('b-block', [])
   * appendClassName('b-block', false)
   * appendClassName('b-block', '')
   */
  const appendClassName: (baseClass: string, extendClass?: string | false | (string | false | undefined)[] | undefined) => string;
  export default appendClassName;
}
declare module "utils/string/modifyClassName" {
  /**
   * Apply BEM modifier to classname
   *
   * @param {string} className
   * @param {string|false} modifier
   *
   * @returns {string} result class name
   *
   * @example
   * // returns 'b-block b-block--main'
   * modifyClassName('b-block', 'main')
   *
   * @example
   * // returns 'b-block'
   * modifyClassName('b-block', false)
   */
  const modifyClassName: (className: string, modifiers?: string | false | string[] | undefined) => string;
  export default modifyClassName;
}
declare module "components/subcomponents/loader-icon/ILoaderIcon" {
  export interface IOwnProps {
      isLoading?: boolean;
      className?: string;
  }
}
declare module "components/subcomponents/loader-icon/LoaderIcon.messages" {
  const definedMessages: {
      loading: {
          id: string;
          defaultMessage: string;
      };
  };
  export default definedMessages;
}
declare module "components/subcomponents/loader-icon/LoaderIcon" {
  import React from 'react';
  import '../../../../node_modules/animate.css/animate.min.css';
  import { IOwnProps } from "components/subcomponents/loader-icon/ILoaderIcon";
  import './LoaderIcon.css';
  export const LoaderIcon: React.FC<IOwnProps>;
  export default LoaderIcon;
}
declare module "components/subcomponents/update-handler/IUpdateHandler" {
  export interface IOwnProps {
      loading: boolean;
  }
}
declare module "components/subcomponents/update-handler/UpdateHandler" {
  import React from 'react';
  import { IOwnProps } from "components/subcomponents/update-handler/IUpdateHandler";
  import './UpdateHandler.css';
  /**
   * Wrapper with loading overlay for components with loading state
   */
  const UpdateHandler: React.FC<IOwnProps>;
  export default UpdateHandler;
}
declare module "constants/RoundingTypes" {
  enum RoundingTypes {
      UP = "UP",
      DOWN = "DOWN"
  }
  export default RoundingTypes;
}
declare module "entities/currency/ICurrency" {
  interface ICurrency {
      /**
       * Currency multiplier related to base currency
       */
      rate: number;
      /**
       * ISO 4217
       * @example RUB, USD, EUR
       */
      code: string;
      /**
       * How many digits should follow after point: 4.00 or 4.0000
       * @example 2
       */
      decimals: number;
      /**
       * Name for currency
       * @example Euro, Dollar
       */
      name: string;
      /**
       * @example €, $
       */
      symbol: string;
      /**
       * How to place a symbol: $ 1000 or 1000 $
       */
      symbolPosition: 'before' | 'after';
      /**
       * Is primary currency at store
       */
      isBase: boolean;
      /**
       * Position
       */
      position: number;
  }
  export default ICurrency;
}
declare module "entities/currency/Currency" {
  import ICurrency from "entities/currency/ICurrency";
  class Currency implements ICurrency {
      rate: number;
      code: string;
      decimals: number;
      name: string;
      symbol: string;
      symbolPosition: 'before' | 'after';
      isBase: boolean;
      position: number;
      constructor(rawCurrency: any);
  }
  export default Currency;
}
declare module "components/subcomponents/price/IPrice" {
  import Currency from "entities/currency/Currency";
  import RoundingTypes from "constants/RoundingTypes";
  export interface IOwnProps {
      className?: string;
      /**
       * Price.
       * String will display as is
       * Number will converted to current currency
       */
      price: string | number;
      discount?: boolean;
      rounding?: RoundingTypes;
  }
  export interface IStateProps {
      currency?: Currency;
  }
  export interface IDispatchProps {
  }
  export type IProps = IOwnProps & IStateProps & IDispatchProps;
}
declare module "components/subcomponents/price/Price" {
  import React from 'react';
  import { IProps } from "components/subcomponents/price/IPrice";
  import './Price.css';
  /**
   * Display formatted price
   */
  const Price: React.FC<IProps>;
  export default Price;
}
declare module "constants/FieldTypes" {
  enum FieldTypes {
      EMAIL = "email",
      PASSWORD = "password",
      SELECTBOX = "select",
      SLAVE_SELECTBOX = "slave-select",
      CHECKBOX = "checkbox",
      TEXT = "text",
      MULTILINE_TEXT = "multiline-text",
      NUMBER = "NUMBER",
      DATETIME = "DATETIME",
      DATE = "DATE",
      RADIO = "R",
      COUNTRY = "O",
      STATE = "A"
  }
  export default FieldTypes;
}
declare module "entities/form/FormFieldValue" {
  class FormFieldValue {
      label: string;
      value: string | number;
      /**
       * Some special criteria (for filtering values for example)
       */
      criteria?: string | number;
      constructor(data: any);
  }
  export default FormFieldValue;
}
declare module "entities/form/FormField" {
  import FormFieldValue from "entities/form/FormFieldValue";
  import FieldTypes from "constants/FieldTypes";
  class FormField {
      name: string;
      label: string;
      type: FieldTypes;
      isRequired: boolean;
      isEnabled: boolean;
      value: string | number;
      values?: FormFieldValue[];
      min?: Date | number | string;
      max?: Date | number | string;
      constructor(data: any);
  }
  export default FormField;
}
declare module "entities/form/FormSection" {
  import FormField from "entities/form/FormField";
  class FormSection {
      id: string;
      title: string;
      fields: FormField[];
      constructor(data: any);
  }
  export default FormSection;
}
declare module "components/subcomponents/select/ISelect" {
  export interface IOwnProps {
      ref?: ((instance: HTMLSelectElement) => void) | React.RefObject<HTMLSelectElement>;
      options: Array<{
          value: string | number;
          label: string;
      }>;
      name: string;
      description: string;
      fullWidth?: boolean;
      error?: boolean;
      helperText?: string;
      disabled?: boolean;
      value?: unknown;
      onChange?: (event: React.ChangeEvent<{
          name?: string | undefined;
          value: unknown;
      }>) => void;
  }
  export type IProps = IOwnProps & React.InputHTMLAttributes<HTMLSelectElement>;
}
declare module "components/subcomponents/select/Select" {
  import React from 'react';
  import { IProps } from "components/subcomponents/select/ISelect";
  const Select: React.FC<IProps>;
  export default Select;
}
declare module "components/subcomponents/input/IInput" {
  export interface IOwnProps {
      ref?: ((instance: HTMLDivElement) => void) | React.RefObject<HTMLDivElement>;
      id?: string;
      label?: string;
      className?: string;
      value?: string;
      error?: boolean;
      helperText?: string;
      disabled?: boolean;
      fullWidth?: boolean;
      multiline?: boolean;
  }
  export type IProps = IOwnProps & React.InputHTMLAttributes<HTMLInputElement>;
}
declare module "components/subcomponents/input/Input" {
  import React from 'react';
  import { IProps } from "components/subcomponents/input/IInput";
  /**
   * Base text input component
   *
   * @param props
   */
  export const Input: React.FC<IProps>;
  export default Input;
}
declare module "components/subcomponents/notifier/INotifier" {
  export interface IOwnProps {
      info?: boolean;
      success?: boolean;
      warning?: boolean;
      error?: boolean;
      className?: string;
  }
  export type IProps = IOwnProps;
}
declare module "components/subcomponents/notifier/Notifier" {
  import React from 'react';
  import { IProps } from "components/subcomponents/notifier/INotifier";
  const Notifier: React.FC<IProps>;
  export default Notifier;
}
declare module "entities/form/IFormSchema" {
  import FormSection from "entities/form/FormSection";
  export interface IFormSchema {
      sections: FormSection[];
  }
  export default IFormSchema;
}
declare module "entities/form/FormSchema" {
  import FormSection from "entities/form/FormSection";
  import FormField from "entities/form/FormField";
  import IFormSchema from "entities/form/IFormSchema";
  class FormSchema implements IFormSchema {
      sections: FormSection[];
      constructor(data: IFormSchema);
      getFields(): FormField[];
      setValues(data: any): FormSchema;
  }
  export default FormSchema;
}
declare module "components/subcomponents/dynamic-form/IDynamicForm" {
  import { WrappedComponentProps } from 'react-intl';
  import FormSchema from "entities/form/FormSchema";
  export interface IOwnProps {
      submitTitle?: string;
      isRequesting: boolean;
      error?: string | null;
      secondButton?: React.ReactNode;
      schema: FormSchema;
      onSubmit?: (values: any) => void;
      onChange?: (data: any, isValid: boolean) => void;
      onCancel?: () => void;
      className?: string;
  }
  export interface IOwnFormValues {
  }
  export type IProps = IOwnProps & WrappedComponentProps;
}
declare module "components/subcomponents/dynamic-form/DynamicForm.messages" {
  const definedMessages: {
      email: {
          id: string;
          defaultMessage: string;
      };
      password: {
          id: string;
          defaultMessage: string;
      };
      tooShort: {
          id: string;
          defaultMessage: string;
      };
      tooLong: {
          id: string;
          defaultMessage: string;
      };
      required: {
          id: string;
          defaultMessage: string;
      };
      invalidEmail: {
          id: string;
          defaultMessage: string;
      };
      submitTitle: {
          id: string;
          defaultMessage: string;
      };
  };
  export default definedMessages;
}
declare module "components/subcomponents/dynamic-form/DynamicForm" {
  import React from 'react';
  import { FormikProps } from 'formik';
  import { IProps, IOwnFormValues } from "components/subcomponents/dynamic-form/IDynamicForm";
  import './DynamicForm.css';
  /**
   * Builder for custom forms with validation by scheme
   *
   * @param props
   */
  const DynamicForm: React.FC<IProps & FormikProps<IOwnFormValues>>;
  export default DynamicForm;
}
declare module "components/subcomponents/dynamic-form/DynamicFormContainer" {
  import { IProps } from "components/subcomponents/dynamic-form/IDynamicForm";
  const _default: import("react").ForwardRefExoticComponent<Pick<IProps, "className" | "onChange" | "onSubmit" | "error" | "schema" | "submitTitle" | "isRequesting" | "secondButton" | "onCancel"> & {
      forwardedRef?: ((instance: any) => void) | import("react").RefObject<any> | null | undefined;
  } & import("react").RefAttributes<any>> & {
      WrappedComponent: import("react").ComponentType<IProps>;
  };
  export default _default;
}
/// <amd-module name="pwajet" />
declare module "pwajet" {
  const internals: {
      core: {
          components: {
              Price: import("react").FC<import("components/subcomponents/price/IPrice").IProps>;
              DynamicForm: import("react").ForwardRefExoticComponent<Pick<import("components/subcomponents/dynamic-form/IDynamicForm").IProps, "className" | "onChange" | "onSubmit" | "error" | "schema" | "submitTitle" | "isRequesting" | "secondButton" | "onCancel"> & {
                  forwardedRef?: ((instance: any) => void) | import("react").RefObject<any> | null | undefined;
              } & import("react").RefAttributes<any>> & {
                  WrappedComponent: import("react").ComponentType<import("components/subcomponents/dynamic-form/IDynamicForm").IProps>;
              };
          };
          entities: {};
      };
  };
  export default internals;
}
