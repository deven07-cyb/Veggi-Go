import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Preloader from "../../components/common/Preloader";
import InputField from "../../components/form/input/InputField";
import Select from "../../components/form/select/Select";
import Button from "../../components/ui/button/Button";
import { FetchData } from "../../utils/FetchData";
import { City } from "../../Types/City";
import { State, StateResponse } from "../../Types/State";

export default function EditCity() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [city, setCity] = useState<City>({
    id: "",
    name: "",
    stateId: "",
    status: true,
    createsAt: new Date(),
    updatedAt: new Date(),
  });

  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(id ? true : false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stateResult = await FetchData<StateResponse>("/state/getAll", "POST", {
          page: 1,
          limit: 1000,
        });

        if (stateResult.status) {
          setStates(stateResult.data.items);
        }

        if (id) {
          setLoading(true);
          const result = await FetchData<any>(`/city/get/${id}`, "GET");

          if (result?.status && result.data) {
            const data = result.data?.city || result.data;

            setCity({
              id: data.id || "",
              name: data.name || "",
              stateId: data.stateId?.id || data.stateId || "",
              status: data.status !== undefined ? data.status : true,
              createsAt: data.createdAt ? new Date(data.createdAt) : new Date(),
              updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch city/state data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: city.name,
      stateId: city.stateId,
      status: city.status,
    };

    const endpoint = id ? `/city/edit/${id}` : "/city/create";
    const result = await FetchData(endpoint, "POST", payload);

    if (result?.status) {
      navigate("/city");
    }
  };

  const handleStatusChange = (value: string) => {
    setCity({ ...city, status: value === "true" });
  };

  const handleStateChange = (value: string) => {
    setCity({ ...city, stateId: value });
  };

  if (loading) return <Preloader />;

  return (
    <>
      <PageMeta
        title={id ? "Edit City" : "Add City"}
        description={id ? "Edit City Details" : "Add New City"}
      />
      <PageBreadcrumb pageTitle={id ? "Edit City" : "Add City"} />

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              {id ? "Edit City" : "Add City"}
            </h3>
            <Button size="sm" variant="primary" onClick={() => navigate("/city")}>
              Back to Cities
            </Button>
          </div>

          <hr className="border-t border-gray-200 dark:border-gray-700" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
            <InputField
              label="City Name"
              type="text"
              required
              value={city.name}
              onChange={(e) => setCity({ ...city, name: e.target.value })}
            />

            <Select
              label="State"
              required
              options={states.map((state) => ({
                label: state.name,
                value: state.id,
              }))}
              onChange={handleStateChange}
              defaultValue={city.stateId}
              placeholder="Select State"
            />

            <Select
              label="Status"
              required
              options={[
                { value: "true", label: "Active" },
                { value: "false", label: "Inactive" },
              ]}
              onChange={handleStatusChange}
              defaultValue={city.status ? "true" : "false"}
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
