import { inject, injectable, } from 'inversify';
import { ServiceIdentifiers } from '../../container/ServiceIdentifiers';

import * as format from 'string-template';

import { TIdentifierNameGeneratorFactory } from '../../types/container/generators/TIdentifierNameGeneratorFactory';
import { TStatement } from '../../types/node/TStatement';

import { IOptions } from '../../interfaces/options/IOptions';
import { IRandomGenerator } from '../../interfaces/utils/IRandomGenerator';

import { ObfuscationTarget } from '../../enums/ObfuscationTarget';

import { initializable } from '../../decorators/Initializable';

import { DebuggerTemplate } from '../../templates/debug-protection-nodes/debug-protection-function-node/DebuggerTemplate';
import { DebuggerTemplateNoEval } from '../../templates/debug-protection-nodes/debug-protection-function-node/DebuggerTemplateNoEval';
import { DebugProtectionFunctionTemplate } from '../../templates/debug-protection-nodes/debug-protection-function-node/DebugProtectionFunctionTemplate';

import { AbstractCustomNode } from '../AbstractCustomNode';
import { NodeUtils } from '../../node/NodeUtils';

@injectable()
export class DebugProtectionFunctionNode extends AbstractCustomNode {
    /**
     * @type {string}
     */
    @initializable()
    private debugProtectionFunctionName: string;

    /**
     * @param {TIdentifierNameGeneratorFactory} identifierNameGeneratorFactory
     * @param {IRandomGenerator} randomGenerator
     * @param {IOptions} options
     */
    constructor (
        @inject(ServiceIdentifiers.Factory__IIdentifierNameGenerator)
            identifierNameGeneratorFactory: TIdentifierNameGeneratorFactory,
        @inject(ServiceIdentifiers.IRandomGenerator) randomGenerator: IRandomGenerator,
        @inject(ServiceIdentifiers.IOptions) options: IOptions
    ) {
        super(identifierNameGeneratorFactory, randomGenerator, options);
    }

    /**
     * @param {string} debugProtectionFunctionName
     */
    public initialize (debugProtectionFunctionName: string): void {
        this.debugProtectionFunctionName = debugProtectionFunctionName;
    }

    /**
     * @returns {TStatement[]}
     */
    protected getNodeStructure (): TStatement[] {
        return NodeUtils.convertCodeToStructure(this.getTemplate());
    }

    /**
     * @returns {string}
     */
    protected getTemplate (): string {
        const debuggerTemplate: string = this.options.target !== ObfuscationTarget.Extension
            ? DebuggerTemplate()
            : DebuggerTemplateNoEval();

        return format(DebugProtectionFunctionTemplate(), {
            debuggerTemplate,
            debugProtectionFunctionName: this.debugProtectionFunctionName
        });
    }
}
