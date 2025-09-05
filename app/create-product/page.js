'use client'
import LayoutAdmin from "@/components/layout/LayoutAdmin"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { use, useState, useEffect } from "react"
import { useRouter } from 'next/navigation';
import { insertData, insertImageData } from "../../components/api/Axios/Helper";
import { insertMultipleUploadImage } from "../../components/common/imageUpload";
import { capitalizeFirstChar, validateYouTubeURL } from "../../components/common/functions";
import PropertyMapMarker from "@/components/elements/PropertyMapMarker";
import ErrorPopup from "../../components/errorPopup/ErrorPopup.js";
import Preloader from "@/components/elements/Preloader";
import SuccessPopup from "@/components/SuccessPopup/SuccessPopup";
import MultipleFileUpload from "@/components/common/MultipleFileUpload";
import SingleFileUpload from "@/components/common/SingleFileUpload";
import { successToast, errorToast, multiErrorToast } from "@/components/common/Toast";
import CurrencyPriceField from "@/components/common/CurrencyPriceField";
import TextField from "@/components/common/TextField";
import TextareaField from "@/components/common/TextareaField";
import NumberField from "@/components/common/NumberField";
import SelectField from "@/components/common/SelectField";
import CheckboxField from "@/components/common/CheckboxField";
import { userType, navigateTo } from "../../components/common/functions";
import ProtectedRoute from '@/components/common/ProtectedRoute';
import RoleList from "@/components/common/RoleList";

export default function CreateProject() {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [sucessMessage, setSucessMessage] = useState(false);
    const [userId, setUserId] = useState("");
    const [neighborhoodList, setNeighborhoodList] = useState([]);
    const [isVideoUpload, setIsVideoUpload] = useState(true);
    const [stateList, setStateList] = useState([]);
    const [developerList, setDeveloperList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [projectOfNumberListing, setProjectOfNumberListing] = useState([]);
    const [projectOfBooleanListing, setProjectOfBooleanListing] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});
    const [videoPreview, setVideoPreview] = useState(null); // State for video preview
    const [iconPreview, setIconPreview] = useState([]);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [currencyList, setCurrencyList] = useState([]);
    const [currencyCode, setCurrencyCode] = useState([]);
    const [propertyOfMetaNumberValue, setPropertyOfMetaNumberValue] = useState([]);
    const router = useRouter();
    const [images, setImages] = useState([]);
    const [iconImages, setIconImages] = useState(null);
    const [isSubmitting, setSubmitting] = useState(false);
    const [keywordsEn, setKeywordsEn] = useState([]);
    const [keywordInputEn, setKeywordInputEn] = useState("");
    const [keywordsFr, setKeywordsFr] = useState([]);
    const [keywordInputFr, setKeywordInputFr] = useState("");

    const [propertyMapCoords, setPropertyMapCoords] = useState({
        latitude: 33.5945144,
        longitude: -7.6200284,
        zoom: 6
    });
    const validationSchema = Yup.object({
        title_en: Yup.string().min(3, "Title English must be at least 3 characters").required("Title English is required"),
        title_fr: Yup.string().min(3, "Title French must be at least 3 characters").required("Title French is required"),
        description_en: Yup.string().required("Description English is required"),
        description_fr: Yup.string().required("Description French is required"),
        price: Yup.string().required("Price is required"),
        currency_id: Yup.string().required("Currency is required"),
        vr_link: Yup.string().url("Invalid VR URL").nullable(),
        state_id: Yup.string().required("State is required"),
        city_id: Yup.string().required("City is required"),
        user_id: Yup.string().required("Developer option is required"),
    });

    const handleKeyDownEn = (e) => {
        if (e.key === "Enter" && keywordInputEn.trim() !== "") {
            e.preventDefault();
            if (!keywordsEn.includes(keywordInputEn.trim())) {
                setKeywordsEn([...keywordsEn, keywordInputEn.trim()]);
            }
            setKeywordInputEn("");
        }
    };

    const handleKeyDownFr = (e) => {
        if (e.key === "Enter" && keywordInputFr.trim() !== "") {
            e.preventDefault();
            if (!keywordsFr.includes(keywordInputFr.trim())) {
                setKeywordsFr([...keywordsFr, keywordInputFr.trim()]);
            }
            setKeywordInputFr("");
        }
    };

    const handleRemoveKeywordEn = (index) => {
        setKeywordsEn(keywordsEn.filter((_, i) => i !== index));
    };

    const handleRemoveKeywordFr = (index) => {
        setKeywordsFr(keywordsFr.filter((_, i) => i !== index));
    };

    const handleStateChange = async (stateId) => {

        setCityList([]);
        setDistrictList([]);
        setNeighborhoodList([]);
        const selectedState = stateList.find((state) => state.id === stateId);
        if (selectedState) {
            const { latitude, longitude } = selectedState;
            setPropertyMapCoords({
                latitude: latitude,
                longitude: longitude,
                zoom: 10
            });
            const cityObj = { state_id: stateId, lang: "en" };
            const getCityInfo = await insertData('api/city/getbystate', cityObj, true);
            if (getCityInfo.status) {
                setCityList(getCityInfo.data.cities);
            }
        }

    };
    const handleCityChange = async (cityId) => {
        const selectedCites = cityList.find((cities) => cities.id === cityId);
        const { latitude, longitude } = selectedCites;
        setPropertyMapCoords({
            latitude: latitude,
            longitude: longitude,
            zoom: 12
        });

        if (!cityId) {
            setDistrictList([]); // Clear cities if no state is selected
            return;
        }
        try {
            const districtObj = { city_id: cityId, lang: "en" };
            const getDistrictInfo = await insertData('api/district/getbycity', districtObj, true);
            if (getDistrictInfo.status) {
                setDistrictList(getDistrictInfo.data);
            } else {
                setDistrictList([]);
            }
        } catch (error) {
            console.error("Error fetching cities:", error);
            setDistrictList([]);
        }
    };

    const handleDistrictChange = async (DistrictId) => {
        const selectedDistricts = districtList.find((districts) => districts.id === DistrictId);
        const { latitude, longitude } = selectedDistricts;
        setPropertyMapCoords({
            latitude: latitude,
            longitude: longitude,
            zoom: 12
        });

        if (!DistrictId) {
            setNeighborhoodList([]); // Clear cities if no state is selected
            return;
        }
        try {
            const districtObj = { district_id: DistrictId, lang: "en" };
            const getNeighborhoodObjInfo = await insertData('api/neighborhood/id', districtObj, true);
            if (getNeighborhoodObjInfo.status) {
                setNeighborhoodList(getNeighborhoodObjInfo.data);
            } else {
                setNeighborhoodList([]);
            }
        } catch (error) {
            console.error("Error fetching cities:", error);
            setNeighborhoodList([]);
        }
    };

    const handleNeighborhoodChange = async (NeighborhoodId) => {
        const selecteNeighborhood = neighborhoodList.find((neighborhoods) => neighborhoods.id === NeighborhoodId);
        if (selecteNeighborhood) {
            const { latitude, longitude } = selecteNeighborhood;
            setPropertyMapCoords({
                latitude: latitude,
                longitude: longitude,
                zoom: 14
            });
        } else {
            console.error('Neighborhood not found');
        }
    };

    const handleNumberChange = (id, value) => {
        setPropertyOfMetaNumberValue((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (values, { resetForm, setErrors }) => {
        setSubmitting(true);
        console.log(values, '>>>>>>> values>>>>>>>>>>>');
        const selectedAmenities = projectOfBooleanListing
            .filter((project) => checkedItems[project.key])
            .map((project) => ({ project_type_listing_id: project.id, value: "true" }));
        if (propertyOfMetaNumberValue && Object.keys(propertyOfMetaNumberValue).length > 0) {
            // Update selected amenities based on propertyOfMetaNumberValue
            Object.entries(propertyOfMetaNumberValue).forEach(([key, value]) => {
                const index = selectedAmenities.findIndex(item => item.property_type_id === key);
                if (index !== -1) {
                    selectedAmenities[index].value = value;
                } else {
                    selectedAmenities.push({ project_type_listing_id: key, value });
                }
            });
        }

        try {

            if (iconImages === null) {
                errorToast("Please upload an icon image.");
                return false;
            }

            if (images.length < 3) {
                errorToast("At least three images are required.");
                return false;
            }
            /********* upload image ***********/
            const uploadImageObj = Array.isArray(values.picture_img) ? values.picture_img : [values.picture_img];
            const videoObj = values.video ? [values.video] : [];
            const iconObj = values.icon ? [values.icon] : [];

            // Combine all files (images, video, icons) for upload
            const allUploadFiles = [...videoObj];
            // const allUploadFilesICon = [...iconObj];
            // if (!iconImages) {
            //     setErrors({ serverError: "Please upload an icon image." });
            //     setShowErrorPopup(true);
            //     return false;
            // }
            // Upload files
            const uploadImageUrl = await insertMultipleUploadImage("image", allUploadFiles);
            //const uploadImageIconUrl = await insertMultipleUploadImage("image", allUploadFilesICon);
            let videoUrl = null;
            let iconUrl = null;
            if (uploadImageUrl.files.length > 0) {
                const imageUrls = [];

                // Process uploaded files to separate URLs
                uploadImageUrl.files.forEach((file) => {
                    if (file.mimeType.startsWith("image")) {
                        imageUrls.push(file.url); // Collect image URLs
                    } else if (file.mimeType.startsWith("video")) {
                        videoUrl = file.url; // Assign video URL
                    }
                });
                // Assign the first icon file's URL to iconUrl
                if (iconImages) {
                    iconUrl = iconImages; // Use the first file's URL
                }

                // Validate YouTube URL if a link is provided
                if (values.video_link && !validateYouTubeURL(values.video_link)) {
                    errorToast("Please upload a valid YouTube video link like https://www.youtube.com/watch?v=YOUR_VIDEO_ID.");
                    setShowErrorPopup(true);
                    return false;
                }

                // Use the provided video link if no video was uploaded
                videoUrl = videoUrl || values.video_link;
            }

            /********* create user ***********/
            const projectData = {

                title_en: values.title_en,
                title_fr: values.title_fr,
                description_en: values.description_en,
                description_fr: values.description_fr,
                price: parseInt(values.price) ?? 0,
                vr_link: values.vr_link ?? null,
                picture: images.length > 0 ? images : [], // Use the images array directly
                icon: iconImages ? iconImages : null, // Use the iconImages state directly
                video: videoUrl,
                user_id: values.user_id,
                state_id: values.state_id,
                city_id: values.city_id,
                district_id: values.districts_id, // Fixed
                neighborhoods_id: values.neighborhood_id, // Fixed
                latitude: isNaN(parseFloat(values.latitude)) ? parseFloat(propertyMapCoords.latitude) : parseFloat(values.latitude),
                longitude: isNaN(parseFloat(values.longitude)) ? parseFloat(propertyMapCoords.longitude) : parseFloat(values.longitude),
                currency_id: values.currency_id,
                meta_details: selectedAmenities,
                address: values.address,
            }
            const createUserInfo = await insertData("api/projects/create", projectData, true);
            console.log("Project creation response:", createUserInfo);

            // if (createUserInfo.status) {
            //     setSubmitting(false);
            //     successToast("Project created successfully.");
            //     resetForm();
            //     router.push("/project-listing");
            // } else {
            //     setSubmitting(false);
            //     errorToast("Failed to create project.");
            //     setShowErrorPopup(true);
            // }
            if (createUserInfo.status === true) {
                const propject_id = createUserInfo.data.id;
                console.log(propject_id, '>>>>>>>> propject_id');
                console.log(values, '>>>>>>>> values');
                console.log(createUserInfo.data.title, '>>>>>>>> createUserInfo.data.title');

                const generatedSlug = createUserInfo.data.slug;

                console.log(generatedSlug, '>>>>>>>>>>>>>>>>>>>>> generatedSlug');
                /********* Create Meta Data ***********/
                try {
                    const metaData = {
                        en_title: values.en_title,
                        fr_title: values.fr_title,
                        en_description: values.en_description ?? "",
                        fr_description: values.fr_description ?? "",
                        en_keyword: keywordsEn.join(", "),
                        fr_keyword: keywordsFr.join(", "),
                        page_id: propject_id.toString(),
                        slug: generatedSlug,
                        type: "PROJECT_DETAILS"
                    };
                    console.log("Meta data to be created:>>>>>>>>", metaData);
                    const createMetaInfo = await insertData('api/meta/create', metaData, true);
                    console.log("Meta data creation response:", createMetaInfo);
                    if (createMetaInfo.status === true) {
                        console.log("Meta data created successfully");
                    } else {
                        console.warn("Meta data creation failed:", createMetaInfo.message);
                        // Don't fail the entire process if meta creation fails
                    }
                } catch (metaError) {
                    console.error("Error creating meta data:", metaError);
                    // Don't fail the entire process if meta creation fails
                }

                resetForm();
                // Reset keyword states
                setKeywordsEn([]);
                setKeywordsFr([]);
                setKeywordInputEn("");
                setKeywordInputFr("");

                router.push('/project-listing');
            } else {
                setErrors({ serverError: createDeveloperInfo.message });
                setShowErrorPopup(true);
            }

        } catch (error) {
            setSubmitting(false);
            errorToast("An unexpected error occurred.");
            setShowErrorPopup(true);
        } finally {
            setSubmitting(false);
            setLoading(false); // Stop loader
        }
    };

    const handleCheckboxChange = (key) => {
        setCheckedItems((prevState) => ({
            ...prevState,
            [key]: !prevState[key], // Toggle the checked state
        }));
    };

    const handleImageChange = (updatedImages) => {
        if (updatedImages.length <= 2 && updatedImages.length !== null) {
            errorToast("At one three image is required.");
            return false;
        } else {
            setImages(updatedImages);
        }
    };

    const handleIconChange = (updatedIconImages) => {
        if (updatedIconImages !== null) {
            setIconImages(updatedIconImages);
        } else {
            errorToast("Please upload an icon image.");
        }
    };
    return (
        <>
            {loading ? (
                <Preloader />
            ) : (
                <>
                    <LayoutAdmin>
                        {/* {errorMessage && <div className={messageClass}>{errorMessage}</div>} */}
                        <Formik
                            initialValues={{
                                title_en: "",
                                title_fr: "",
                                description_en: "",
                                description_fr: "",
                                price: "",
                                currency_id: "",
                                vr_link: "",
                                picture_img: [], // Set this to an empty array for multiple files
                                icon: null, // Set this to an empty array for multiple files
                                video: null, // Use `null` for file inputs
                                state_id: "",
                                city_id: "",
                                districts_id: "",
                                neighborhood_id: "",
                                user_id: "",

                                title_en: "",
                                title_fr: "",
                                meta_description_en: "",
                                meta_description_fr: "",
                                keyword_en: "",
                                keyword_fr: ""
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ errors, touched, handleChange, handleBlur, setFieldValue, values }) => (
                                <Form>
                                    <div>
                                        <div className="widget-box-2">
                                            <div className="box grid-2 gap-30">
                                                <h6 className="title">Create Product</h6>
                                            </div>
                                            <div className="box grid-2 gap-30">
                                                <TextField name="product_name" label="Product Name:" required={true} />
                                                <SelectField name="category" label="Category:" required={true} options={developerList} onChange={handleChange} setFieldValue={setFieldValue} />
                                            </div>
                                            <div className="grid-1 box gap-30">
                                                <TextareaField name="description_en" label="Description English:" required={true} />
                                                <br /><br /><br />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="tf-btn primary"
                                            onClick={() => setShowErrorPopup(!showErrorPopup)}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Submitting..." : "Add Project"}
                                        </button>
                                    </div >
                                    {/* Error Popup */}
                                    {showErrorPopup && Object.keys(errors).length > 0 && (
                                        multiErrorToast(Object.values(errors))
                                    )}
                                </Form>
                            )}
                        </Formik>
                    </LayoutAdmin >
                </>)}
        </>
    )
}