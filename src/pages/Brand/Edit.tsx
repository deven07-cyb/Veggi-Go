import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Preloader from "../../components/common/Preloader";
import InputField from "../../components/form/input/InputField";
import Select from "../../components/form/select/Select";
import Button from "../../components/ui/button/Button";
import { FetchData } from "../../utils/FetchData";
import { Brand } from "../../Types/Brand";

export default function EditBrand() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [brand, setBrand] = useState<Brand>({
    id: "",
    name: "",
    status: true,
    createsAt: new Date(),
    updatedAt: new Date(),
  });

  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    const fetchBrand = async () => {
      if (id) {
        setLoading(true);
        try {
          const result = await FetchData(`/brand-type/get/${id}`, "GET");

          if (result?.status && result.data) {
            const data = result.data as Brand;

            setBrand({
              id: data.id || "",
              name: data.name || "",
              status: data.status !== undefined ? data.status : true,
              createsAt: data.createsAt ? new Date(data.createsAt) : new Date(),
              updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
            });
          }
        } catch (error) {
          console.error("Failed to fetch brand:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBrand();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: brand.name,
      status: brand.status,
    };

    const endpoint = id ? `/brand-type/edit/${id}` : "/brand-type/create";
    const result = await FetchData(endpoint, "POST", payload);

    if (result?.status) {
      navigate("/brand");
    }
  };

  const handleStatusChange = (value: string) => {
    setBrand({ ...brand, status: value === "true" });
  };

  if (loading) return <Preloader />;

  return (
    <>
      <PageMeta
        title={id ? "Edit Brand" : "Add Brand"}
        description={id ? "Edit Brand Details" : "Add New Brand"}
      />
      <PageBreadcrumb pageTitle={id ? "Edit Brand" : "Add Brand"} />

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              {id ? "Edit Brand" : "Add Brand"}
            </h3>
            <Button size="sm" variant="primary" onClick={() => navigate("/brand")}>
              Back to Brands
            </Button>
          </div>

          <hr className="border-t border-gray-200 dark:border-gray-700" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
            <InputField
              label="Brand Name"
              type="text"
              required
              value={brand.name}
              onChange={(e) => setBrand({ ...brand, name: e.target.value })}
            />

            <Select
              label="Status"
              required
              options={[
                { value: "true", label: "Active" },
                { value: "false", label: "Inactive" },
              ]}
              onChange={handleStatusChange}
              defaultValue={brand.status ? "true" : "false"}
            />

            <div className="flex justify-end space-x-3">
              <Button size="sm" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
