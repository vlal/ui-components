import { darken } from 'polished';

import { colors } from './colors';

// component-specific
export const atoms = {
  Alert: {
    default: {
      color: colors.black,
      background: colors.gray50,
      borderColor: darken(0.15, colors.gray50),
    },
    info: {
      color: colors.white,
      background: colors.blue600,
      borderColor: darken(0.15, colors.blue600),
    },
    success: {
      color: colors.white,
      background: colors.status.success,
      borderColor: darken(0.15, colors.status.success),
    },
    warning: {
      color: colors.white,
      background: colors.status.warning,
      borderColor: darken(0.15, colors.status.warning),
    },
    error: {
      color: colors.white,
      background: colors.status.error,
      borderColor: darken(0.15, colors.status.error),
    },
  },
  Button: {
    default: {
      color: colors.black,
      background: colors.white,
      hoverColor: colors.purple800,
      hoverBackground: darken(0.05, colors.white),
    },
    primary: {
      color: colors.white,
      background: colors.blue700,
      hoverColor: colors.white,
      hoverBackground: darken(0.05, colors.blue700),
    },
    danger: {
      color: colors.white,
      background: colors.status.error,
      hoverColor: colors.white,
      hoverBackground: darken(0.05, colors.status.error),
    },
    disabled: {
      color: colors.gray600,
      background: colors.gray50,
      hoverColor: colors.gray600,
      hoverBackground: colors.gray50,
    },
  },
};
