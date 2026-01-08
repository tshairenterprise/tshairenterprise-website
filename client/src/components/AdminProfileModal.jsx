import React, { useState, useEffect } from 'react';
import api from "@/lib/axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Loader2 } from "lucide-react";
import { sooner } from "@/components/ui/use-sooner.jsx";

const AdminProfileModal = ({ isOpen, onOpenChange }) => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [previewAvatar, setPreviewAvatar] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            setUser(userInfo);
            if (userInfo) {
                setName(userInfo.name);
                setPreviewAvatar(userInfo.avatar);
            }
        }
    }, [isOpen]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setPreviewAvatar(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const loadingSooner = sooner.loading(
            "Updating Admin Profile",
            "Saving changes, including new avatar or password..."
        );

        setLoading(true);

        try {
            // const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const formData = new FormData();

            // Sirf wahi data bhejo jo change karna hai
            formData.append('name', name);
            if (password) formData.append('password', password);
            if (avatarFile) formData.append('avatar', avatarFile);

            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            };

            const { data } = await api.put('/users/profile', formData, config);

            // Local Storage Update
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);

            // 2. Success Sooner Update
            loadingSooner.update({
                title: "Profile Updated!",
                description: "Changes saved. Reloading page to display new image.",
                variant: "success",
                duration: 3000
            });

            setPassword("");
            onOpenChange(false);

            // Reload page to show new image everywhere (with delay for UX)
            setTimeout(() => window.location.reload(), 1000);

        } catch (error) {

            const errorMessage = error.response?.data?.message || "Profile update failed.";

            // 3. Error Sooner Update
            loadingSooner.update({
                title: "Update Failed",
                description: errorMessage,
                variant: "destructive",
                duration: 5000
            });

            console.error("Update Error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white rounded-2xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900">Edit Admin Profile</DialogTitle>
                    <DialogDescription>
                        Update your profile details and avatar below.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleUpdate} className="space-y-6 mt-4">
                    <div className="flex justify-center">
                        <div className="relative group cursor-pointer">
                            <Avatar className="h-24 w-24 border-4 border-gray-100 shadow-sm">
                                <AvatarImage src={previewAvatar} className="object-cover" />
                                <AvatarFallback className="bg-primary text-white text-2xl font-bold">{user.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload className="h-5 w-5 text-white" />
                            </div>
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} accept="image/*" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Name</label>
                            <Input value={name} onChange={e => setName(e.target.value)} className="mt-1" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">New Password</label>
                            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Leave blank to keep current" className="mt-1" />
                        </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-purple-700 text-white">
                        {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Save Changes"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AdminProfileModal;