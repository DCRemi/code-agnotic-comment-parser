// Generic
export interface TagIndex {
	tag: string;
	tagStart: number;
	tagEnd: number;
}

export interface GenericTagSentence {
	tag: string;
	tag_content: string;
}

export interface GenericCommentBlock {
	blocNumber: number;
	genericTagSentences: GenericTagSentence[];
}

export interface GenericGlobalComments {
	genericCommentBlocks: GenericCommentBlock[];
}

// Specific
export interface ParamTag {
	param_type: string;
	param_name: string;
	param_desc: string;
}

export interface DescriptionTag {
	description: string;
}

export interface GenericTag {
	tag: string;
	content: string;
}

export interface SeeTag {
	see_content: string;
}

export interface ExampleTag {
	example_content: string;
}

export interface StepDefTag {
	description: string;
}

export interface TodoTag {
	todo_type: string;
	todo_text: string;
}

export interface CommentBlock {
	level1?: string;
	level2?: string;
	level3?: string;
	memberof?: string;
	stepDef?: string;
	paramTags?: ParamTag[];
	descriptionTags?: DescriptionTag[];
	seeTags?: SeeTag[];
	exampleTags?: ExampleTag[];
	todoTags?: TodoTag[];
	genericTags?: GenericTag[];
}

// Levels
export interface Level_3 {
	levelName: string;
	levelDesc: string;
}

export interface Level_2 {
	levelName: string;
	levelDesc: string;
	commentBlocks?: CommentBlock[];
	htmlNavBar?: string;
}

export interface Level_1 {
	levelName: string;
	levelDesc: string;
	level_2s: Level_2[];
	noLevel2Blocks?: CommentBlock[];
}

export interface Levels {
	level_1s: Level_1[];
	noLevel1Blocks?: CommentBlock[];
}
