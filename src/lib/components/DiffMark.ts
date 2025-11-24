import { Mark, mergeAttributes } from '@tiptap/core';

export interface DiffMarkOptions {
	HTMLAttributes: Record<string, any>;
}

export type DiffType = 'added' | 'removed' | 'unchanged';

export interface DiffMarkAttributes {
	diffType: DiffType;
}

export const DiffMark = Mark.create<DiffMarkOptions>({
	name: 'diff',

	addOptions() {
		return {
			HTMLAttributes: {}
		};
	},

	addAttributes() {
		return {
			diffType: {
				default: 'unchanged',
				parseHTML: (element) => element.getAttribute('data-diff-type') as DiffType || 'unchanged',
				renderHTML: (attributes) => {
					return {
						'data-diff-type': attributes.diffType
					};
				}
			}
		};
	},

	parseHTML() {
		return [
			{
				tag: 'span[data-diff-type]'
			}
		];
	},

	renderHTML({ HTMLAttributes }) {
		const diffType = HTMLAttributes['data-diff-type'] as DiffType;
		
		let className = '';
		switch (diffType) {
			case 'added':
				className = 'bg-green-200 text-green-900';
				break;
			case 'removed':
				className = 'bg-red-200 text-red-900 line-through';
				break;
			case 'unchanged':
			default:
				className = '';
				break;
		}

		return [
			'span',
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
				class: className
			}),
			0
		];
	},

	addCommands() {
		return {
			setDiff:
				(attributes: DiffMarkAttributes) =>
				({ commands }: any) => {
					return commands.setMark(this.name, attributes);
				},
			unsetDiff:
				() =>
				({ commands }: any) => {
					return commands.unsetMark(this.name);
				}
		} as any;
	}
});
