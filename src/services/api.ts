/// <reference types="vite/client" />
import axios from "axios";
import {
  Blog,
  Portfolio,
  Product,
  Service,
  ServiceMenuCategory,
  ServiceCategory,
  ServiceCategoryDetail,
  ServiceSubcategoryDetail,
  CaseStudy,
  Career,
  Review,
  Author,
  AboutContent,
  TeamMember,
  PageMetricsContent,
  LegalContent
} from "../types/api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to extract data from axios response
const getData = <T>(response: any): T => response.data?.data || response.data;

export const apiService = {
  // Blogs
  getBlogs: () => apiClient.get("/blogs").then(res => getData<Blog[]>(res)),
  getFeaturedBlogs: () => apiClient.get("/blogs/featured").then(res => getData<Blog[]>(res)),
  getBlogById: (id: string) => apiClient.get(`/blogs/${id}`).then(res => getData<Blog>(res)),
  getBlogBySlug: (slug: string) => apiClient.get(`/blogs/slug/${slug}`).then(res => getData<Blog>(res)),

  // Portfolio
  getPortfolios: () => apiClient.get("/portfolio").then(res => getData<Portfolio[]>(res)),
  getPortfolioById: (id: string) => apiClient.get(`/portfolio/${id}`).then(res => getData<Portfolio>(res)),

  // Products
  getProducts: () => apiClient.get("/products").then(res => getData<Product[]>(res)),
  getPinnedProducts: () => apiClient.get("/products/pinned").then(res => getData<Product[]>(res)),
  getProductById: (id: string) => apiClient.get(`/products/${id}`).then(res => getData<Product>(res)),

  // Services
  getServices: () => apiClient.get("/services").then(res => getData<Service[]>(res)),
  getServiceById: (id: string) => apiClient.get(`/services/${id}`).then(res => getData<Service>(res)),
  getServiceMenu: () => apiClient.get("/services/menu").then(res => getData<ServiceMenuCategory[]>(res)),
  getServiceCategories: () => apiClient.get("/services/categories").then(res => getData<ServiceCategory[]>(res)),
  getServiceCategoryBySlug: (categorySlug: string) =>
    apiClient.get(`/services/categories/${categorySlug}`).then(res => getData<ServiceCategoryDetail>(res)),
  getServiceSubcategoryBySlugs: (categorySlug: string, subcategorySlug: string) =>
    apiClient.get(`/services/categories/${categorySlug}/subcategories/${subcategorySlug}`).then(res => getData<ServiceSubcategoryDetail>(res)),

  // Case Studies
  getCaseStudies: () => apiClient.get("/case-studies").then(res => getData<CaseStudy[]>(res)),
  getCaseStudyById: (id: string) => apiClient.get(`/case-studies/${id}`).then(res => getData<CaseStudy>(res)),

  // Careers
  getCareers: () => apiClient.get("/careers").then(res => getData<Career[]>(res)),
  getCareerById: (id: string) => apiClient.get(`/careers/${id}`).then(res => getData<Career>(res)),

  // Reviews
  getReviews: () => apiClient.get("/reviews").then(res => getData<Review[]>(res)),

  // Authors / Content
  getAuthors: () => apiClient.get("/authors").then(res => getData<Author[]>(res)),
  getAboutContent: () => apiClient.get("/about-content").then(res => getData<AboutContent>(res)),
  getTeamMembers: () => apiClient.get("/team-members").then(res => getData<TeamMember[]>(res)),
  getPageMetrics: () => apiClient.get("/page-metrics").then(res => getData<PageMetricsContent>(res)),
  getLegalContent: () => apiClient.get("/legal-content").then(res => getData<LegalContent>(res)),

  // Upload
  uploadFiles: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    return apiClient.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }).then(res => getData<any>(res));
  },

  // Project Requests
  createProjectRequest: (data: any) => apiClient.post("/project-requests", data).then(res => getData<any>(res)),
  updateProjectRequest: (id: string, data: any) => apiClient.patch(`/project-requests/${id}`, data).then(res => getData<any>(res)),

  // Contact Requests
  createContactRequest: (data: any) => apiClient.post("/contact-requests", data).then(res => getData<any>(res)),

  // Newsletter
  subscribeNewsletter: (data: any) => apiClient.post("/newsletter-subscriptions", data).then(res => getData<any>(res)),

  // Job Applications
  createJobApplication: (data: any) => apiClient.post("/job-applications", data).then(res => getData<any>(res)),
};
