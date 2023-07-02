import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getNewsById, updateNewsById } from 'apiSdk/news';
import { Error } from 'components/error';
import { newsValidationSchema } from 'validationSchema/news';
import { NewsInterface } from 'interfaces/news';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { BroadcasterInterface } from 'interfaces/broadcaster';
import { UserInterface } from 'interfaces/user';
import { getBroadcasters } from 'apiSdk/broadcasters';
import { getUsers } from 'apiSdk/users';

function NewsEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<NewsInterface>(
    () => (id ? `/news/${id}` : null),
    () => getNewsById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: NewsInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateNewsById(id, values);
      mutate(updated);
      resetForm();
      router.push('/news');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<NewsInterface>({
    initialValues: data,
    validationSchema: newsValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit News
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="title" mb="4" isInvalid={!!formik.errors?.title}>
              <FormLabel>Title</FormLabel>
              <Input type="text" name="title" value={formik.values?.title} onChange={formik.handleChange} />
              {formik.errors.title && <FormErrorMessage>{formik.errors?.title}</FormErrorMessage>}
            </FormControl>
            <FormControl id="content" mb="4" isInvalid={!!formik.errors?.content}>
              <FormLabel>Content</FormLabel>
              <Input type="text" name="content" value={formik.values?.content} onChange={formik.handleChange} />
              {formik.errors.content && <FormErrorMessage>{formik.errors?.content}</FormErrorMessage>}
            </FormControl>
            <FormControl id="category" mb="4" isInvalid={!!formik.errors?.category}>
              <FormLabel>Category</FormLabel>
              <Input type="text" name="category" value={formik.values?.category} onChange={formik.handleChange} />
              {formik.errors.category && <FormErrorMessage>{formik.errors?.category}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<BroadcasterInterface>
              formik={formik}
              name={'broadcaster_id'}
              label={'Select Broadcaster'}
              placeholder={'Select Broadcaster'}
              fetcher={getBroadcasters}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'news',
    operation: AccessOperationEnum.UPDATE,
  }),
)(NewsEditPage);
