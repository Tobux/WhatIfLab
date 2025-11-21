import { Mark, mergeAttributes } from '@tiptap/core';

export interface CommentMarkOptions {
	HTMLAttributes: Record<string, any>;
}

export interface CommentMarkAttributes {
	commentId: string;
}

export const CommentMark = Mark.create<CommentMarkOptions>({
	name: 'comment',

	addOptions() {
		return {
			HTMLAttributes: {}
		};
	},

	addAttributes() {
		return {
			commentId: {
				default: null,
				parseHTML: (element) => element.getAttribute('data-comment-id'),
				renderHTML: (attributes) => {
					if (!attributes.commentId) {
						return {};
					}
					return {
						'data-comment-id': attributes.commentId
					};
				}
			},
			isHovered: {
				default: false,
				parseHTML: (element) => element.getAttribute('data-hovered') === 'true',
				renderHTML: (attributes) => {
					if (attributes.isHovered) {
						return {
							'data-hovered': 'true'
						};
					}
					return {};
				}
			}
		};
	},

	parseHTML() {
		return [
			{
				tag: 'mark[data-comment-id]'
			}
		];
	},

	renderHTML({ HTMLAttributes }) {
		const isHovered = HTMLAttributes['data-hovered'] === 'true';
		const className = isHovered
			? 'bg-yellow-400 text-black px-0.5 rounded-sm ring-2 ring-yellow-600 ring-offset-1'
			: 'bg-blue-500 text-white px-0.5 rounded-sm';

		return [
			'mark',
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
				class: className
			}),
			0
		];
	},

	addCommands() {
		return {
			setComment:
				(attributes: CommentMarkAttributes) =>
				({ commands }: any) => {
					return commands.setMark(this.name, attributes);
				},
			toggleComment:
				(attributes: CommentMarkAttributes) =>
				({ commands }: any) => {
					return commands.toggleMark(this.name, attributes);
				},
			unsetComment:
				() =>
				({ commands }: any) => {
					return commands.unsetMark(this.name);
				}
		} as any;
	}
});
