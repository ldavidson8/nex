import * as v from 'valibot';

export const NamedResourceSchema = v.object({
	name: v.string(),
	url: v.string()
});

export type NameUrl = v.InferOutput<typeof NamedResourceSchema>;
