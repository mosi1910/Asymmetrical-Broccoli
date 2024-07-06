const schema = {
    nodes: {
        heading:  {
            sortOrder: 400,
            attrs: {level: {default: 1}},
            content: "(text | image)*",
            group: "block",
            defining: true,
            parseDOM: [{tag: "h1", attrs: {level: 1}},
                {tag: "h2", attrs: {level: 2}},
                {tag: "h3", attrs: {level: 3}},
                {tag: "h4", attrs: {level: 4}},
                {tag: "h5", attrs: {level: 5}},
                {tag: "h6", attrs: {level: 6}}],
            toDOM: (node) => {
                return ["h" + node.attrs.level, 0]
            },
            parseMarkdown: {
                block: "heading", getAttrs: function (tok) {
                    return ({level: +tok.tag.slice(1)});
                }
            },
            toMarkdown: (state, node) => {
                state.write(state.repeat("#", node.attrs.level) + " ");
                state.renderInline(node);
                state.closeBlock(node);
            }
        }
    }
};

export {schema}