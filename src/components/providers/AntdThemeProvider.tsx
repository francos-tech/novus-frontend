'use client'
import React, { useEffect, useState } from 'react';
import { ConfigProvider } from 'antd';
import { useTheme } from '@/hooks/useTheme';

// Dark theme configuration for Ant Design
const darkTheme = {
  token: {
    colorBgContainer: '#404040',
    colorBgElevated: '#404040',
    colorBgLayout: '#404040',
    colorBgSpotlight: '#404040',
    colorBgMask: 'rgba(0, 0, 0, 0.45)',
    colorText: '#F5F5F5',
    colorTextSecondary: '#F5F5F5',
    colorTextTertiary: '#F5F5F5',
    colorTextQuaternary: '#F5F5F5',
    colorTextPlaceholder: '#A0A0A0',
    colorTextDisabled: '#666666',
    colorTextDescription: '#F5F5F5',
    colorTextHeading: '#F5F5F5',
    colorTextLabel: '#F5F5F5',
    colorTextBase: '#F5F5F5',
    colorBorder: '#666666',
    colorBorderSecondary: '#666666',
    colorFill: '#666666',
    colorFillSecondary: '#666666',
    colorFillTertiary: '#666666',
    colorFillQuaternary: '#666666',
    colorPrimary: '#2a85ff',
    colorPrimaryHover: '#4996ff',
    colorPrimaryActive: '#2a85ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    borderRadius: 6,
    wireframe: false,
  },
  components: {
    Form: {
      colorTextLabel: '#F5F5F5',
      colorTextDescription: '#F5F5F5',
    },
    Input: {
      colorBgContainer: '#404040',
      colorText: '#F5F5F5',
      colorTextPlaceholder: '#A0A0A0',
      colorBorder: '#666666',
      colorBorderSecondary: '#666666',
    },
    Select: {
      colorBgContainer: '#404040',
      colorText: '#F5F5F5',
      colorTextPlaceholder: '#A0A0A0',
      colorBorder: '#666666',
      colorBorderSecondary: '#666666',
    },
    DatePicker: {
      colorBgContainer: '#404040',
      colorText: '#F5F5F5',
      colorTextPlaceholder: '#A0A0A0',
      colorBorder: '#666666',
      colorBorderSecondary: '#666666',
    },
    InputNumber: {
      colorBgContainer: '#404040',
      colorText: '#F5F5F5',
      colorTextPlaceholder: '#A0A0A0',
      colorBorder: '#666666',
      colorBorderSecondary: '#666666',
    },
    Button: {
      colorBgContainer: '#2a85ff',
      colorText: '#2a85ff',
      colorBorder: '#2a85ff',
    },
    Card: {
      colorBgContainer: '#404040',
      colorText: '#F5F5F5',
      colorBorder: '#666666',
    },
    Checkbox: {
      colorBgContainer: '#404040',
      colorText: '#F5F5F5',
      colorBorder: '#666666',
    },
    Typography: {
      colorText: '#F5F5F5',
      colorTextHeading: '#F5F5F5',
    },
    Divider: {
      colorBorder: '#666666',
    },
  },
};

// Light theme configuration for Ant Design
const lightTheme = {
  token: {
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f5f5f5',
    colorBgSpotlight: '#ffffff',
    colorBgMask: 'rgba(0, 0, 0, 0.45)',
    colorText: '#262626',
    colorTextSecondary: '#595959',
    colorTextTertiary: '#8c8c8c',
    colorTextQuaternary: '#bfbfbf',
    colorTextPlaceholder: '#bfbfbf',
    colorTextDisabled: '#bfbfbf',
    colorTextDescription: '#8c8c8c',
    colorTextHeading: '#262626',
    colorTextLabel: '#262626',
    colorTextBase: '#262626',
    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#f0f0f0',
    colorFill: '#f5f5f5',
    colorFillSecondary: '#fafafa',
    colorFillTertiary: '#fafafa',
    colorFillQuaternary: '#fafafa',
    colorPrimary: '#1890ff',
    colorPrimaryHover: '#40a9ff',
    colorPrimaryActive: '#096dd9',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    borderRadius: 6,
    wireframe: false,
  },
  components: {
    Form: {
      colorTextLabel: '#262626',
      colorTextDescription: '#8c8c8c',
    },
    Input: {
      colorBgContainer: '#ffffff',
      colorText: '#262626',
      colorTextPlaceholder: '#bfbfbf',
      colorBorder: '#d9d9d9',
      colorBorderSecondary: '#f0f0f0',
    },
    Select: {
      colorBgContainer: '#ffffff',
      colorText: '#262626',
      colorTextPlaceholder: '#bfbfbf',
      colorBorder: '#d9d9d9',
      colorBorderSecondary: '#f0f0f0',
    },
    DatePicker: {
      colorBgContainer: '#ffffff',
      colorText: '#262626',
      colorTextPlaceholder: '#bfbfbf',
      colorBorder: '#d9d9d9',
      colorBorderSecondary: '#f0f0f0',
    },
    InputNumber: {
      colorBgContainer: '#ffffff',
      colorText: '#262626',
      colorTextPlaceholder: '#bfbfbf',
      colorBorder: '#d9d9d9',
      colorBorderSecondary: '#f0f0f0',
    },
    Button: {
      colorBgContainer: '#ffffff',
      colorText: '#262626',
      colorBorder: '#d9d9d9',
    },
    Card: {
      colorBgContainer: '#ffffff',
      colorText: '#262626',
      colorBorder: '#d9d9d9',
    },
    Checkbox: {
      colorBgContainer: '#ffffff',
      colorText: '#262626',
      colorBorder: '#d9d9d9',
    },
    Typography: {
      colorText: '#262626',
      colorTextHeading: '#262626',
    },
    Divider: {
      colorBorder: '#d9d9d9',
    },
  },
};

interface AntdThemeProviderProps {
  children: React.ReactNode;
}

export default function AntdThemeProvider({ children }: AntdThemeProviderProps) {
  const { isDark } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ConfigProvider theme={isDark ? darkTheme : lightTheme}>
      {children}
    </ConfigProvider>
  );
} 