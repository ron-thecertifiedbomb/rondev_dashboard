'use client';

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import 'quill/dist/quill.snow.css';
import Quill from 'quill';

export type RichTextEditorHandle = {
    getContent: () => string;
    clear: () => void;
};

const RichTextEditor = forwardRef<RichTextEditorHandle>((_, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);

    // Custom image handler for Cloudinary
    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            try {
                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("/api/upload-image", {
                    method: "POST",
                    body: formData,
                });

                const data = await res.json();
                if (data.url && quillRef.current) {
                    const range = quillRef.current.getSelection();
                    quillRef.current.insertEmbed(range?.index || 0, "image", data.url);
                }
            } catch (err) {
                console.error("Image upload failed:", err);
                alert("Image upload failed");
            }
        };
    };

    useEffect(() => {
        if (!editorRef.current) return;

        quillRef.current = new Quill(editorRef.current, {
            theme: 'snow',
            placeholder: 'Write something...',
            modules: {
                toolbar: {
                    container: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ color: [] }, { background: [] }],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['link', 'image'],
                        ['clean'],
                    ],
                    handlers: {
                        image: imageHandler, // <-- custom handler
                    },
                },
            },
        });

        return () => {
            quillRef.current = null;
        };
    }, []);

    useImperativeHandle(ref, () => ({
        getContent: () => quillRef.current?.root.innerHTML || '',
        clear: () => quillRef.current?.setContents([]),
    }));

    return (
        <div
            ref={editorRef}
            style={{
                height: '400px',
                maxWidth: '800px',
                margin: '0 auto',
                background: 'white',
            }}
        />
    );
});

RichTextEditor.displayName = 'RichTextEditor';
export default RichTextEditor;
