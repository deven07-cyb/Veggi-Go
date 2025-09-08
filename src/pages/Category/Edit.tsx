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
import { Categories } from '../../Types/Category';
import { getImageName } from '../../components/common/Function';
import { UploadedImage } from "../../Types/UploadedImage";

export default function EditCategory() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    const [category, setCategory] = useState<Categories>({
        id: '',
        name: '',
        image: '',
        status: true,
        createsAt: new Date(),
        updatedAt: new Date()
    });

    const [loading, setLoading] = useState(id ? true : false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (id) {
            const getCategoryById = async () => {
                setLoading(true);
                try {
                    const result = await FetchData<any>(`/categories/get/${id}`, 'GET');
                    if (result && result.status) {
                        const data = result.data;
                        setCategory({
                            id: data.id || '',
                            name: data.name || '',
                            image: data.image || '',
                            status: data.status !== undefined ? data.status : true,
                            createsAt: data.createdAt ? new Date(data.createdAt) : new Date(),
                            updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date()
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch category:", error);
                } finally {
                    setLoading(false);
                }
            };
            getCategoryById();
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
                status: category.status,
            };

            const endpoint = id ? `/categories/edit/${id}` : '/categories/create';
            const result = await FetchData(endpoint, 'POST', parameter);

            if (result.status) {
                navigate('/category');
            }
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    const handleStatusChange = (value: string) => {
        setCategory({ ...category, status: value === 'true' });
    };

    if (loading) return <Preloader />;

    return (
        <>
            <PageMeta
                title={id ? "Edit Category" : "Add Category"}
                description={id ? "Edit Category Details" : "Add New Category"}
            />
            <PageBreadcrumb pageTitle={id ? "Edit Category" : "Add Category"} />

            <div className="space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                    <div className="flex items-center justify-between px-6 py-3">
                        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                            {id ? "Edit Category" : "Add Category"}
                        </h3>
                        <Button size="sm" variant="primary" onClick={() => navigate("/category")}>Back to Category</Button>
                    </div>
                    <hr className="border-t border-gray-200 dark:border-gray-700" />
                    <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
                        <InputField
                            label="Category Name"
                            type="text"
                            required={true}
                            value={category.name}
                            onChange={(e) => setCategory({ ...category, name: e.target.value })}
                        />

                        <FileInput
                            label="Category Image"
                            ref={fileInputRef}
                            fileName={
                                id
                                    ? category.image !== ''
                                        ? getImageName(category.image.toString())
                                        : 'default.png'
                                    : ''
                            }
                            onChange={() => {
                                setCategory({ ...category, image: category.image });
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
