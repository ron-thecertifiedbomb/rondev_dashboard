'use client';

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import type QuillType from 'quill';
import 'quill/dist/quill.snow.css';

export type RichTextEditorHandle = {
    getContent: () => string;
    clear: () => void;
};

const RichTextEditor = forwardRef<RichTextEditorHandle>((_, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<QuillType | null>(null);
    const initializedRef = useRef(false); // ✅ ref to prevent double init

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (initializedRef.current) return; // skip if already initialized

        import('quill').then((QuillModule) => {
            const Quill = QuillModule.default;
            if (editorRef.current) {
                quillRef.current = new Quill(editorRef.current, {
                    theme: 'snow',
                    placeholder: 'Write something...',
                    modules: {
                        toolbar: [
                            [{ header: [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ color: [] }, { background: [] }],
                            [{ list: 'ordered' }, { list: 'bullet' }],
                            ['link', 'image'],
                            ['clean'],
                        ],
                    },
                });
                initializedRef.current = true; // mark as initialized
            }
        });
    }, []);

    useImperativeHandle(ref, () => ({
        getContent: () => quillRef.current?.root.innerHTML || '',
        clear: () => quillRef.current?.setContents([]),
    }));

    return <div ref={editorRef} style={{ height: '400px', background: 'white' }} />;
});

RichTextEditor.displayName = 'RichTextEditor';
export default RichTextEditor;
