<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useRouterPush } from '@/hooks/common/router';
import { useFormRules, useAntdvForm } from '@/hooks/common/form';
import { useCaptcha } from '@/hooks/business/captcha';
import { $t } from '@/locales';

defineOptions({
  name: 'CodeLogin'
});

const { toggleLoginModule } = useRouterPush();
const { formRef, validate } = useAntdvForm();
const { label, isCounting, loading, getCaptcha } = useCaptcha();

interface FormModel {
  phone: string;
  code: string;
}

const model: FormModel = reactive({
  phone: '',
  code: ''
});

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  const { formRules } = useFormRules();

  return {
    phone: formRules.phone,
    code: formRules.code
  };
});

async function handleSubmit() {
  await validate();
  // request
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
