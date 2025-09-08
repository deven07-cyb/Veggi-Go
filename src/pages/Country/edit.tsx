import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Preloader from "../../components/common/Preloader";
import InputField from "../../components/form/input/InputField";
import Select from "../../components/form/select/Select";
import Button from "../../components/ui/button/Button";
import { FetchData } from "../../utils/FetchData";
import { Country } from "../../Types/Country"; // 👈 import interface

export default function EditCountry() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [country, setCountry] = useState<Country>({
    id: "",
    name: "",
    countryCode: "",
    status: true,
    createsAt: new Date(),
    updatedAt: new Date(),
  });

  const [loading, setLoading] = useState(id ? true : false);

  useEffect(() => {
    const fetchCountryById = async () => {
      if (id) {
        setLoading(true);
        try {
          const result = await FetchData<any>(`/country/get/${id}`, "GET");

          if (result?.status && result.data) {
            const data = result.data;
            setCountry({
              id: data.id || "",
              name: data.name || "",
              countryCode: data.countryCode || data.code || "", // fallback to `code`
              status: data.status !== undefined ? data.status : true,
              createsAt: data.createsAt ? new Date(data.createsAt) : new Date(),
              updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
            });
          } else {
            console.error("Invalid response:", result);
          }
        } catch (error) {
          console.error("Failed to fetch country:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCountryById();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: country.name,
      countryCode: country.countryCode,
      status: country.status,
    };
    const endpoint = id ? `/country/edit/${id}` : "/country/create";
    const result = await FetchData(endpoint, "POST", payload);
    if (result?.status) {
      navigate("/country");
    }
  };

  const handleStatusChange = (value: string) => {
    setCountry({ ...country, status: value === "true" });
  };

  if (loading) return <Preloader />;

  return (
    <>
      <PageMeta
        title={id ? "Edit Country" : "Add Country"}
        description={id ? "Edit Country Details" : "Add New Country"}
      />
      <PageBreadcrumb pageTitle={id ? "Edit Country" : "Add Country"} />

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              {id ? "Edit Country" : "Add Country"}
            </h3>
            <Button size="sm" variant="primary" onClick={() => navigate("/country")}>
              Back to Countries
            </Button>
          </div>

          <hr className="border-t border-gray-200 dark:border-gray-700" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
            <InputField
              label="Country Name"
              type="text"
              required
              value={country.name}
              onChange={(e) => setCountry({ ...country, name: e.target.value })}
            />

            <InputField
              label="Country Code"
              type="text"
              required
              value={country.countryCode}
              onChange={(e) => setCountry({ ...country, countryCode: e.target.value })}
            />

            <Select
              label="Status"
              required
              options={[
                { value: "true", label: "Active" },
                { value: "false", label: "Inactive" },
              ]}
              onChange={handleStatusChange}
              defaultValue={country.status ? "true" : "false"}
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
