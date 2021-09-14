/**
 * Get HTML Template
 *
 * @param selector Element selector
 */
export default (selector: string) => {
  return document.importNode(
    (document.querySelector(selector) as HTMLTemplateElement).content,
    true
  );
};
