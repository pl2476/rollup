import MagicString from 'magic-string';
import { RenderOptions } from '../../utils/renderHelpers';
import * as NodeType from './NodeType';
import { StatementBase } from './shared/Node';

export default class ExpressionStatement extends StatementBase {
	directive?: string;

	initialise() {
		this.included = false;
		if (
			this.directive &&
			this.directive !== 'use strict' &&
			this.parent.type === NodeType.Program
		) {
			this.context.warn(
				// This is necessary, because either way (deleting or not) can lead to errors.
				{
					code: 'MODULE_LEVEL_DIRECTIVE',
					message: `Module level directives cause errors when bundled, '${
						this.directive
					}' was ignored.`
				},
				this.start
			);
		}
	}

	shouldBeIncluded() {
		if (this.directive && this.directive !== 'use strict')
			return this.parent.type !== NodeType.Program;

		return super.shouldBeIncluded();
	}

	render(code: MagicString, options: RenderOptions) {
		super.render(code, options);
		if (this.included) this.insertSemicolon(code);
	}
}
