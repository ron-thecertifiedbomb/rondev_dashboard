'use client';

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Quill styles

export type RichTextEditorHandle = {
    getContent: () => string;
    clear: () => void;
};

const RichTextEditor = forwardRef<RichTextEditorHandle>((_, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);

    useEffect(() => {
        if (editorRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                placeholder: 'Write something...',
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ color: [] }, { background: [] }], // <-- text and background color
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['link', 'image'],
                        ['clean'],
                    ],
                },
            });
        }

        return () => {
            quillRef.current = null; // cleanup
        };
    }, []);

    useImperativeHandle(ref, () => ({
        getContent: () => quillRef.current?.root.innerHTML || '',
        clear: () => {
            if (quillRef.current) quillRef.current.setContents([]);
        },
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
