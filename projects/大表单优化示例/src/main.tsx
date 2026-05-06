import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { FormProvider } from './context/FormContext';
import { FormPage } from './components/FormPage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider>
    <FormProvider>
      <FormPage />
    </FormProvider>
  </ConfigProvider>
);
