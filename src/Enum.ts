import { AnyFn } from "./shared";

type CreateVariant<
  Name,
  Descriptor extends AcceptedDescriptor
> = Descriptor extends AnyFn
  ? Readonly<{
      type: Name;
      payload: ReturnType<Descriptor>;
    }>
  : Descriptor extends null
  ? Readonly<{ type: Name }>
  : never;

type CreateVariantConstructor<
  Tag,
  Descriptor extends AcceptedDescriptor,
  Ret
> = {
  (
    ...params: Descriptor extends AnyFn
      ? Parameters<Descriptor>
      : []
  ): Ret;
  /**
   * !: Do not access this variable in runtime
   */
  $type: CreateVariant<Tag, Descriptor>;
};

type CreateVariantUnion<Descriptors extends DescriptorsBase> = {
  [Name in keyof Descriptors]: CreateVariant<Name, Descriptors[Name]>;
}[keyof Descriptors];

type CreateEnumInstance<Descriptors extends DescriptorsBase> = {
  [Tag in keyof Descriptors]: CreateVariantConstructor<
    Tag,
    Descriptors[Tag],
    CreateVariantUnion<Descriptors>
  >;
} & {
  /**
   * !: Do not access this variable in runtime
   */
  $type: CreateVariantUnion<Descriptors>;
};

type AcceptedDescriptor = AnyFn | null;

type DescriptorsBase = Record<string, AcceptedDescriptor>;

// TODO: Some name should not used as Tag, such as `_` and `$type`

export function Enum<Descriptors extends DescriptorsBase>(
  descriptors: Descriptors
): CreateEnumInstance<Descriptors>;
export function Enum(
  rawVariants: Record<string, null | AnyFn>
): Record<string, AnyFn> {
  const ret: Record<string, AnyFn> = {};

  Object.entries(rawVariants).forEach(([key, constructor]) => {
    if (constructor === null) {
      const variant = Object.freeze({
        type: key,
      });
      ret[key] = () => variant;
    } else if (typeof constructor === "function") {
      ret[key] = (...args: any[]) => {
        return Object.freeze({
          type: key,
          payload: constructor(...args),
        });
      };
    } else {
      throw new TypeError(
        `Expect \`null\` | \`function\` but got ${typeof constructor} for key "${key}"`
      );
    }
  });

  return ret;
}
