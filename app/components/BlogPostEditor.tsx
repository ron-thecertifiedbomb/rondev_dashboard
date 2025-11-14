'use client';

import React, { useRef, useState } from 'react';
import  { RichTextEditorHandle } from './RichTextEditor';
import dynamic from 'next/dynamic';


// Dynamically import RichTextEditor to avoid SSR
const RichTextEditor = dynamic(() => import('./RichTextEditor'), { ssr: false });


export default function BlogPostEditor() {
    const editorRef = useRef<RichTextEditorHandle>(null);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim()) return alert('Please enter a title');
        const content = editorRef.current?.getContent() || '';

        const payload = { title: title.trim(), content, createdBy: null };

        setLoading(true);
        try {
            const res = await fetch('http://localhost:8080/api/blogs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error(`Failed to post: ${res.status}`);

            const saved = await res.json();
            alert('Blog posted!');
            setTitle(''); // clear title
            editorRef.current?.clear(); // <-- clear editor content
            console.log('Saved blog:', saved);
        } catch (err: unknown) {
            alert('Error posting blog: ' + (err instanceof Error ? err.message : String(err)));
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="w-full flex justify-center mt-8">
            <div className="w-full max-w-3xl">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Blog Title"
                    className="w-full p-2 mb-4 border rounded"
                />
                <RichTextEditor ref={editorRef} />
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                    >
                        {loading ? 'Posting...' : 'Post Blog'}
                    </button>
                </div>
            </div>
        </div>
    );
}
