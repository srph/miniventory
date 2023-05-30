import { TextSelect, TextSelectProps } from "~/components";
import { api } from "~/utils/api";

type BrandSelectProps = Pick<TextSelectProps, "name" | "value" | "onChange">;

const BrandSelect: React.FC<BrandSelectProps> = (props) => {
  const { data: brandsQuery } = api.brands.getAll.useQuery({ search: "" });

  return (
    <TextSelect {...props} label="Product Line" placeholder="Select brand...">
      {brandsQuery?.brands.map((brand) => {
        return (
          <option value={brand.id} key={brand.id}>
            {brand.name}
          </option>
        );
      })}
    </TextSelect>
  );
};

export { BrandSelect };
