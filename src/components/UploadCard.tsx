"use client";

type Props = {
    file: File | null;
    previewUrl: string | null;
    onPick: (f: File) => void;
    onClear: () => void;
};

export default function UploadCard({ file, previewUrl, onPick, onClear }: Props) {
    return (
        <div className="glass rounded-3xl p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Upload scalp photo</h2>
                    <p className="text-slate-400 text-sm mt-1">
                        Best results: bright lighting, top/crown visible, no filters.
                    </p>
                </div>

                {file && (
                    <button
                        onClick={onClear}
                        className="text-slate-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1"
                    >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                        Remove
                    </button>
                )}
            </div>

            <label className="block cursor-pointer">
                <input
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        if (f.size > 10 * 1024 * 1024) {
                            alert("File must be under 10MB");
                            return;
                        }
                        onPick(f);
                    }}
                />

                <div className="border border-dashed border-white/10 rounded-3xl p-6 hover:border-indigo-500/30 hover:bg-white/[0.02] transition-all duration-300">
                    {!previewUrl ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5">
                                <span className="material-symbols-outlined text-indigo-400 text-[32px]">
                                    cloud_upload
                                </span>
                            </div>
                            <div className="font-semibold text-lg mb-1">
                                Drag & drop or click to upload
                            </div>
                            <div className="text-slate-500 text-sm">
                                PNG or JPG · Max 10MB
                            </div>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6 items-center">
                            <div className="relative rounded-2xl overflow-hidden border border-white/10">
                                <img
                                    src={previewUrl}
                                    alt="preview"
                                    className="w-full h-64 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="material-symbols-outlined text-emerald-400 text-[18px]">
                                        check_circle
                                    </span>
                                    <span className="text-sm text-emerald-400 font-medium">
                                        Image selected
                                    </span>
                                </div>
                                <div className="font-semibold break-all text-sm mb-3">
                                    {file?.name}
                                </div>
                                <div className="text-slate-500 text-xs leading-relaxed">
                                    Tip: If hair is wet or lighting is dim, results may be less accurate.
                                    For best results, use a dry scalp photo with even overhead lighting.
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </label>
        </div>
    );
}
