import Peggy from 'peggy';

// @ts-ignore
import GRAMMAR from './grammar_methods.pegjs';

export const MethodParser = Peggy.generate(GRAMMAR);