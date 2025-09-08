import { useEffect, useState, useRef } from 'react';
import Preloader from "../../components/common/Preloader";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { FetchData } from "../../utils/FetchData";
import { FetchImageData } from "../../utils/FetchImageData";
import { useNavigate, useSearchParams } from 'react-router-dom';
import InputField from "../../components/form/input/InputField";
import FileInput from "../../components/form/input/FileInput";
import Select from "../../components/form/select/Select";
import Button from '../../components/ui/button/Button';
import { SubCategories } from '../../Types/SubCategory';
import { getImageName } from '../../components/common/Function';
import { Categories } from '../../Types/Category';
import { UploadedImage } from "../../Types/UploadedImage";

export default function EditSubCategory() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const [category, setSubCategory] = useState<SubCategories>({
    id: '',
    name: '',
    image: '',
    categoryId: '',
    status: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const [loading, setLoading] = useState(id ? true : false);
  const [categories, setCategories] = useState<Categories[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const body = {
          page: 1,
          limit: 10000
        }
        const result = await FetchData<any>('/categories/getAll', 'POST', body);
        if (result.status) {
          setCategories(result.data.categories);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();

    if (id) {
      const getSubCategoryById = async () => {
        setLoading(true);
        try {
          const result = await FetchData<any>(`/sub-categories/get/${id}`, 'GET');
          if (result && result.status) {
            const subcategoryData = result.data;
            setSubCategory({
              id: subcategoryData.id || '',
              name: subcategoryData.name || '',
              image: subcategoryData.image || '',
              categoryId: subcategoryData.categoryId || '',
              status: subcategoryData.status !== undefined ? subcategoryData.status : true,
              createdAt: subcategoryData.createdAt ? new Date(subcategoryData.createdAt) : new Date(),
              updatedAt: subcategoryData.updatedAt ? new Date(subcategoryData.updatedAt) : new Date()
            });
          }
        } catch (error) {
          console.error("Failed to fetch sub-category:", error);
        } finally {
          setLoading(false);
        }
      };
      getSubCategoryById();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageURL = category.image;

      const file = fileInputRef.current?.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append("images", file);

        const addImage = await FetchImageData<UploadedImage[]>("/upload/image", "POST", formData, {}, true);
        if (Array.isArray(addImage.data)) {
          imageURL = addImage.data[0].url;
        }
      }

      const parameter = {
        name: category.name,
        image: imageURL,
        categoryId: category.categoryId,
        status: category.status,
      };

      const endpoint = id ? `/sub-categories/edit/${id}` : '/sub-categories/create';
      const result = await FetchData(endpoint, 'POST', parameter);
      if (result.status) {
        navigate('/sub-category');
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleStatusChange = (value: string) => {
    setSubCategory({ ...category, status: value === 'true' });
  };

  const handleCategoryChange = (value: string) => {
    setSubCategory({ ...category, categoryId: value });
  };

  if (loading) return <Preloader />;

  return (
    <>
      <PageMeta
        title={id ? "Edit Sub Categories" : "Add Sub Categories"}
        description={id ? "Edit Sub Categories Details" : "Add New Sub Categories"}
      />
      <PageBreadcrumb pageTitle={id ? "Edit Sub Categories" : "Add Sub Categories"} />

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          {/* Header line with title and button */}
          <div className="flex items-center justify-between px-6 py-3">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              {id ? "Edit Sub Categories" : "Add Sub Category"}
            </h3>
            <Button size="sm" variant="primary" onClick={() => navigate("/sub-category")}>
              Back to Sub Categories
            </Button>
          </div>

          {/* Full width divider line */}
          <hr className="border-t border-gray-200 dark:border-gray-700" />

          {/* Form content inside same box */}
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
            <InputField
              label="Sub Category Name"
              type="text"
              required={true}
              value={category.name}
              onChange={(e) => setSubCategory({ ...category, name: e.target.value })}
            />

            <Select
              label="Category"
              required={true}
              options={categories.map((cat) => ({
                label: cat.name,
                value: cat.id
              }))}
              onChange={handleCategoryChange}
              defaultValue={category.categoryId || ''}
            />

            <FileInput
              label="Sub Category Image"
              ref={fileInputRef}
              fileName={
                id
                  ? category.image !== ''
                    ? getImageName(category.image.toString())
                    : 'default.png'
                  : ''
              }
              onChange={() => {
                setSubCategory({ ...category, image: category.image });
              }}
            />

            <Select
              label="Status"
              required={true}
              options={[
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' }
              ]}
              onChange={handleStatusChange}
              defaultValue={category.status ? 'true' : 'false'}
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
