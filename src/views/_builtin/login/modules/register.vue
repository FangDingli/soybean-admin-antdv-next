<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useRouterPush } from '@/hooks/common/router';
import { useFormRules, useAntdvForm } from '@/hooks/common/form';
import { useCaptcha } from '@/hooks/business/captcha';
import { $t } from '@/locales';

defineOptions({
  name: 'Register'
});

const { toggleLoginModule } = useRouterPush();
const { formRef, validate } = useAntdvForm();
const { label, isCounting, loading, getCaptcha } = useCaptcha();

interface FormModel {
  phone: string;
  code: string;
  password: string;
  confirmPassword: string;
}

const model: FormModel = reactive({
  phone: '',
  code: '',
  password: '',
  confirmPassword: ''
});

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  const { formRules, createConfirmPwdRule } = useFormRules();

  return {
    phone: formRules.phone,
    code: formRules.code,
    password: formRules.pwd,
    confirmPassword: createConfirmPwdRule(model.password)
  };
});

async function handleSubmit() {
  await validate();
  // request to register
  window.$message?.success($t('page.login.common.validateSuccess'));
}
</script>

<template>
  <AForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false" @keyup.enter="handleSubmit">
    <AFormItem name="phone">
      <AInput v-model:value="model.phone" :placeholder="$t('page.login.common.phonePlaceholder')" />
    </AFormItem>
    <AFormItem name="code">
      <div class="w-full flex-y-center gap-16px">
        <AInput v-model:value="model.code" :placeholder="$t('page.login.common.codePlaceholder')" />
        <AButton size="large" :disabled="isCounting" :loading="loading" @click="getCaptcha(model.phone)">
          {{ label }}
        </AButton>
      </div>
    </AFormItem>
    <AFormItem name="password">
      <AInputPassword v-model:value="model.password" :placeholder="$t('page.login.common.passwordPlaceholder')" />
    </AFormItem>
    <AFormItem name="confirmPassword">
      <AInputPassword
        v-model:value="model.confirmPassword"
        :placeholder="$t('page.login.common.confirmPasswordPlaceholder')"
      />
    </AFormItem>
    <div class="flex flex-col gap-18px">
      <AButton type="primary" size="large" round block @click="handleSubmit">
        {{ $t('common.confirm') }}
      </AButton>
      <AButton size="large" round block @click="toggleLoginModule('pwd-login')">
        {{ $t('page.login.common.back') }}
      </AButton>
    </div>
  </AForm>
</template>

<style scoped></style>
