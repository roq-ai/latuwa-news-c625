import * as yup from 'yup';

export const newsValidationSchema = yup.object().shape({
  title: yup.string().required(),
  content: yup.string().required(),
  category: yup.string().required(),
  broadcaster_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
