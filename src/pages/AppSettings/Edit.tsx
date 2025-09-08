import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Preloader from "../../components/common/Preloader";
import InputField from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { FetchData } from "../../utils/FetchData";
import { AppSetting } from "../../Types/AppSettings";

export default function EditAppSetting() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [appSetting, setAppSetting] = useState<AppSetting>({
    id: "",
    title: "",
    slug: "",
    value: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    const fetchAppSetting = async () => {
      if (id) {
        setLoading(true);
        try {
          const result = await FetchData(`/app-data/get/${id}`, "GET");

          if (result?.status && result.data) {
            const data = result.data as AppSetting;

            setAppSetting({
              id: data.id || "",
              title: data.title || "",
              slug: data.slug || "",
              value: data.value || "",
              createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
              updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
            });
          }
        } catch (error) {
          console.error("Failed to fetch App Setting:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAppSetting();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: appSetting.title,
      value: appSetting.value,
    };

    const endpoint = id ? `/app-data/edit/${id}` : "/app-data/create";
    const result = await FetchData(endpoint, "POST", payload);

    if (result?.status) {
      navigate("/app-settings");
    }
  };

  if (loading) return <Preloader />;

  return (
    <>
      <PageMeta
        title={id ? "Edit App Setting" : "Add App Setting"}
        description={id ? "Edit App Setting Details" : "Add New App Setting"}
      />
      <PageBreadcrumb pageTitle={id ? "Edit App Setting" : "Add App Setting"} />

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              {id ? "Edit App Setting" : "Add App Setting"}
            </h3>
            <Button size="sm" variant="primary" onClick={() => navigate("/app-settings")}>
              Back to Settings
            </Button>
          </div>

          <hr className="border-t border-gray-200 dark:border-gray-700" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
            <InputField
              label="App Setting Title"
              type="text"
              required
              value={appSetting.title}
              onChange={(e) => setAppSetting({ ...appSetting, title: e.target.value })}
            />

            <InputField
              label="App Setting Value"
              type="text"
              required
              value={appSetting.value}
              onChange={(e) => setAppSetting({ ...appSetting, value: e.target.value })}
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
