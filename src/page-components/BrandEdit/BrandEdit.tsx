import React from "react";
import Head from "next/head";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import { TextInput, Button, FormSection, FormActions } from "~/ui-components";
import { config } from "~/config";
import { api } from "~/utils/api";

const schema = z.object({
  name: z.string().min(1),
});

type FormState = z.infer<typeof schema>;

const BrandEdit = () => {
  const form = useForm<FormState>({
    resolver: zodResolver(schema),
  });

  const { query } = useRouter();

  const handleQuerySuccess = (query) => {
    form.reset({
      name: query.brand.name,
    });
  };

  const { data: brandQuery } = api.brands.getById.useQuery(
    { id: String(query.id) },
    { enabled: Boolean(query.id), onSuccess: handleQuerySuccess }
  );

  const { push } = useRouter();

  const handleSuccess = () => {
    push("/brands");
  };

  const {
    mutate: updateBrandMutation,
    isLoading: isUpdateBrandMutationLoading,
  } = api.brands.update.useMutation({ onSuccess: handleSuccess });

  const onSubmit = form.handleSubmit((values) => {
    console.log(values);

    updateBrandMutation({
      ...values,
      id: String(query.id),
    });
  });

  return (
    <>
      <Head>
        <title>
          {config.app.title} - Edit Brand
          {brandQuery && ` - ${brandQuery.brand.name}`}
        </title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mx-auto w-[888px] px-2">
        <h2 className="text-2xl">Edit Brand</h2>

        <div className="mb-16"></div>

        <FormProvider {...form}>
          <form onSubmit={onSubmit}>
            <FormSection
              title="General Information"
              description="This will be used to categorize to which brand an inventory item belongs to."
            >
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <TextInput
                      {...field}
                      error={fieldState.error?.message}
                      label="Name"
                      placeholder="Jollibee"
                    />
                  );
                }}
              />
            </FormSection>

            <FormActions>
              <Button
                type="submit"
                variant="primary"
                disabled={isUpdateBrandMutationLoading}
              >
                Update Brand
              </Button>
            </FormActions>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export { BrandEdit };
