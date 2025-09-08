import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Preloader from "../../components/common/Preloader";
import InputField from "../../components/form/input/InputField";
import Select from "../../components/form/select/Select";
import Button from "../../components/ui/button/Button";
import { FetchData } from "../../utils/FetchData";
import { State } from "../../Types/State";
import { Country, CountryResponse } from "../../Types/Country";

export default function EditState() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [state, setState] = useState<State>({
    id: "",
    name: "",
    countryId: "",
    status: true,
    createsAt: new Date().toISOString(),
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(id ? true : false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const countryResult = await FetchData<CountryResponse>("/country/getAll", "POST", {
          page: 1,
          limit: 1000,
        });

        if (countryResult.status) {
          setCountries(countryResult.data.countries);
        }

        if (id) {
          setLoading(true);
          const result = await FetchData<any>(`/state/get/${id}`, "GET");

          if (result?.status && result.data) {
            const data = result.data?.state || result.data;
            setState({
              id: data.id || "",
              name: data.name || "",
              countryId: data.countryId?.id || data.countryId || "",
              status: data.status !== undefined ? data.status : true,
              createsAt: data.createdAt || new Date().toISOString(),
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch state/country data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: state.name,
      countryId: state.countryId,
      status: state.status,
    };

    const endpoint = id ? `/state/edit/${id}` : "/state/create";
    const result = await FetchData(endpoint, "POST", payload);

    if (result?.status) {
      navigate("/state");
    }
  };

  const handleStatusChange = (value: string) => {
    setState({ ...state, status: value === "true" });
  };

  const handleCountryChange = (value: string) => {
    setState({ ...state, countryId: value });
  };

  if (loading) return <Preloader />;

  return (
    <>
      <PageMeta
        title={id ? "Edit State" : "Add State"}
        description={id ? "Edit State Details" : "Add New State"}
      />
      <PageBreadcrumb pageTitle={id ? "Edit State" : "Add State"} />

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              {id ? "Edit State" : "Add State"}
            </h3>
            <Button size="sm" variant="primary" onClick={() => navigate("/state")}>
              Back to States
            </Button>
          </div>

          <hr className="border-t border-gray-200 dark:border-gray-700" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
            <InputField
              label="State Name"
              type="text"
              required
              value={state.name}
              onChange={(e) => setState({ ...state, name: e.target.value })}
            />

            <Select
              label="Country"
              required
              options={countries.map((country) => ({
                label: country.name,
                value: country.id,
              }))}
              onChange={handleCountryChange}
              defaultValue={state.countryId}
              placeholder="Select Country"
            />

            <Select
              label="Status"
              required
              options={[
                { value: "true", label: "Active" },
                { value: "false", label: "Inactive" },
              ]}
              onChange={handleStatusChange}
              defaultValue={state.status ? "true" : "false"}
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
