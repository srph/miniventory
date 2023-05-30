import React from "react";
import Head from "next/head";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import {
  TextInput,
  Button,
  FormSection,
  FormSectionSpacer,
  FormDivider,
  FormActions,
} from "~/ui-components";
import { config } from "~/config";
import { api } from "~/utils/api";
import { BrandSelect } from "./BrandAutocomplete";
import { ThumbnailUploader } from "~/shared-components/ThumbnailUploader";

const schema = z.object({
  name: z.string().min(1),
  brandId: z.string().min(1),
  factoryPrice: z.preprocess(Number, z.number().min(1)),
  retailPrice: z.preprocess(Number, z.number().min(1)),
  thumbnailUrl: z.string().optional(),
});

type FormState = z.infer<typeof schema>;

const InventoryCreate = () => {
  const form = useForm<FormState>({
    resolver: zodResolver(schema),
  });

  const { push } = useRouter();

  const handleSuccess = () => {
    push("/inventory");
  };

  const { mutate: createItemMutation, isLoading: isCreateItemMutationLoading } =
    api.inventory.create.useMutation({ onSuccess: handleSuccess });

  const onSubmit = form.handleSubmit((values) => {
    createItemMutation(values);
  });

  return (
    <>
      <Head>
        <title>{config.app.title} - New Inventory Item</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mx-auto w-[888px] px-2">
        <h2 className="text-2xl">New Inventory Item</h2>

        <div className="mb-16"></div>

        <FormProvider {...form}>
          <form onSubmit={onSubmit}>
            <FormSection
              title="General Information"
              description="This information will be displayed publicly so be careful what you share."
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
                      placeholder="Sinigang ni Joyce"
                    />
                  );
                }}
              />

              <FormSectionSpacer />

              <Controller
                name="brandId"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <BrandSelect
                      value={field.value}
                      onChange={field.onChange}
                      error={fieldState.error?.message}
                    />
                  );
                }}
              />
            </FormSection>

            <FormDivider />

            <FormSection
              title="Product Thumbnail"
              description="This will be served as a visual identifier for the product. (Optional)"
            >
              <Controller
                name="thumbnailUrl"
                control={form.control}
                render={({ field }) => {
                  return (
                    <ThumbnailUploader
                      file={field.value}
                      onUpload={field.onChange}
                    />
                  );
                }}
              />
            </FormSection>

            <FormDivider />

            <FormSection
              title="Product Prices"
              description="This information will be displayed publicly so be careful what you share."
            >
              <Controller
                name="factoryPrice"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <TextInput
                      {...field}
                      error={fieldState.error?.message}
                      label="Factory Price"
                      placeholder="265.00"
                    />
                  );
                }}
              />

              <FormSectionSpacer />

              <Controller
                name="retailPrice"
                control={form.control}
                render={({ field }) => {
                  return (
                    <TextInput
                      {...field}
                      label="Retail Price"
                      placeholder="300.00"
                    />
                  );
                }}
              />
            </FormSection>

            <FormActions>
              <Button
                type="submit"
                variant="primary"
                disabled={isCreateItemMutationLoading}
              >
                Create Item
              </Button>
            </FormActions>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export { InventoryCreate };
