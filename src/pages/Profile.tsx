import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Shield, Save, Loader2, Camera, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";
import Header from "@/components/Header";
import SemicircleFooter from "@/components/SemicircleFooter";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        role: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/users/profile");
                setUserData(res.data.data);
            } catch (error) {
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.put("/users/profile", { name: userData.name });
            toast.success("Profile updated successfully");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                <Header />
                <main className="container mx-auto px-4 md:px-6 py-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-4 mb-8">
                            <Skeleton className="w-12 h-12 rounded-2xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-10 w-48 rounded-md" />
                                <Skeleton className="h-4 w-64 rounded-md" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-1 space-y-6">
                                <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                                    <Skeleton className="w-32 h-32 rounded-full mb-6" />
                                    <Skeleton className="h-6 w-3/4 rounded-md mb-2" />
                                    <Skeleton className="h-6 w-1/2 rounded-full" />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 space-y-8">
                                    <div className="grid grid-cols-1 gap-6">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="space-y-2">
                                                <Skeleton className="h-3 w-24 rounded-md" />
                                                <Skeleton className="w-full h-14 rounded-2xl" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-4">
                                        <Skeleton className="w-full h-16 rounded-2xl" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <SemicircleFooter />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Header />
            <main className="container mx-auto px-4 md:px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Header Section */}
                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md transition-all text-slate-500 hover:text-primary"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white">
                                My <span className="text-primary italic">Profile</span>
                            </h1>
                            <p className="text-slate-500">Manage your account settings and preferences</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Profile Card */}
                        <div className="md:col-span-1 space-y-6">
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                                <div className="relative mb-6">
                                    <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center text-primary border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden">
                                        <User className="w-16 h-16" />
                                    </div>
                                    <button className="absolute bottom-0 right-0 p-2.5 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">{userData.name}</h2>
                                <p className="text-sm font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">{userData.role}</p>
                            </div>
                        </div>

                        {/* Edit Form */}
                        <div className="md:col-span-2">
                            <form onSubmit={handleUpdate} className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 space-y-8">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary group-focus-within:scale-110 transition-transform" />
                                            <input
                                                type="text"
                                                value={userData.name}
                                                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                                className="w-full h-14 pl-12 pr-6 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/50 rounded-2xl outline-none transition-all font-bold text-slate-900 dark:text-white"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 opacity-60">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address (Read-only)</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                                            <input
                                                type="email"
                                                value={userData.email}
                                                readOnly
                                                className="w-full h-14 pl-12 pr-6 bg-slate-100 dark:bg-slate-800 border-2 border-transparent rounded-2xl outline-none font-bold text-slate-500 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 opacity-60">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Account Role</label>
                                        <div className="relative">
                                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                                            <input
                                                type="text"
                                                value={userData.role}
                                                readOnly
                                                className="w-full h-14 pl-12 pr-6 bg-slate-100 dark:bg-slate-800 border-2 border-transparent rounded-2xl outline-none font-bold text-slate-500 cursor-not-allowed uppercase"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <motion.button
                                        type="submit"
                                        disabled={isSaving}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full h-16 bg-primary text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-[0_12px_24px_-8px_rgba(30,190,120,0.5)] transition-all hover:shadow-[0_20px_40px_-12px_rgba(30,190,120,0.6)] disabled:opacity-50"
                                    >
                                        {isSaving ? (
                                            <Loader2 className="w-7 h-7 animate-spin" />
                                        ) : (
                                            <>
                                                <Save className="w-6 h-6" />
                                                <span>Save Changes</span>
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </main>
            <SemicircleFooter />
        </div>
    );
};

export default Profile;
