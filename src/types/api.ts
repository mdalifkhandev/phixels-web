export interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}

export interface Blog {
    _id: string;
    title: string;
    writer: string;
    readingTime: string;
    details: string;
    tags: string[];
    image: string;
    categoryName?: string;
    createdAt: string;
    createTime?: string;
    updatedAt?: string;
    slug?: string;
    status?: 'draft' | 'published';
    isFeatured?: boolean;
    serviceId?: string;
}

export interface Portfolio {
    _id: string;
    title: string;
    client: string;
    category: string;
    technology: string[];
    activeUsers: string;
    image: string;
    liveLink: string;
    createdAt: string;
    description?: string; // For frontend mapping
}

export interface Product {
    _id: string;
    name: string;
    description: string;
    features: string[];
    pricing?: number;
    demoLink: string;
    images: string[];
    category: string;
    reviewRating?: number | null;
    userCount?: number | null;
    downloadsEnabled?: boolean;
    downloadCount?: number | null;
    isPinned?: boolean;
    pinOrder?: 1 | 2 | 3 | null;
    createdAt: string;
    tagline?: string; // For frontend mapping
}

export interface Service {
    _id: string;
    title: string;
    description: string;
    icon: string;
    features: string[];
    images: string[];
    createdAt: string;
    subcategories?: string[]; // For frontend mapping
}

export interface ServiceMenuSubcategory {
    name: string;
    slug: string;
}

export interface ServiceMenuCategory {
    _id: string;
    name: string;
    slug: string;
    iconKey: string;
    sortOrder?: number;
    subcategories: ServiceMenuSubcategory[];
}

export interface ServiceCategory {
    _id: string;
    name: string;
    slug: string;
    description: string;
    iconKey: string;
    heroImage?: string;
    bannerImage?: string;
    sortOrder?: number;
    isActive?: boolean;
}

export interface ServiceSubcategory {
    _id: string;
    categoryId: string;
    name: string;
    slug: string;
    shortDescription: string;
    longDescription?: string;
    coverImage?: string;
    gallery?: string[];
    keyFeatures?: string[];
    techStack?: string[];
    processSteps?: string[];
    sortOrder?: number;
    isActive?: boolean;
}

export interface ServiceCategoryDetail {
    category: ServiceCategory;
    subcategories: ServiceSubcategory[];
}

export interface ServiceSubcategoryDetail {
    category: ServiceCategory;
    subcategory: ServiceSubcategory;
}

export interface CaseStudy {
    _id: string;
    title: string;
    client: string;
    category: string;
    challenge: string;
    solution: string;
    result: string;
    image: string;
    link: string;
    createdAt: string;
}

export interface Career {
    _id: string;
    jobTitle: string;
    jobType: string;
    location: string;
    description: string;
    requirements: string[];
    responsibilities: string[];
    salaryRange: string;
    deadline: string;
    applicationEmail: string;
    createdAt: string;
}

export interface Review {
    _id: string;
    name: string;
    role: string;
    image: string;
    rating: number;
    review: string;
    project: string;
    budget: string;
    duration: string;
    summary: string;
    createdAt?: string;
    updatedAt?: string;
}
