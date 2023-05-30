import React from "react";

interface FormSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="flex space-x-16">
      <div className="w-[320px] shrink-0">
        <h4 className="font-medium text-neutral-400">{title}</h4>
        <div className="mb-4"></div>

        <p className="leading-normal">{description}</p>
      </div>

      <div className="w-full">{children}</div>
    </div>
  );
};

const FormSectionSpacer: React.FC = () => {
  return <div className="mb-6" />;
};

interface FormDividerProps {
  empty?: boolean;
}

const FormDivider: React.FC<FormDividerProps> = ({ empty }) => {
  return (
    <div className="py-16">
      <div className={empty ? "" : "border-b border-neutral-800"} />
    </div>
  );
};

const FormActions: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <div className="mb-16"></div>
      <div className="flex items-center justify-end">{children}</div>
    </>
  );
};

export { FormSection, FormSectionSpacer, FormDivider, FormActions };
