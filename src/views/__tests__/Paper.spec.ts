import { mount } from '@vue/test-utils'
import Paper from '../Paper.vue'
import { expect, describe, it } from 'vitest'
import router from '@/router'
import { createTestingPinia } from '@pinia/testing'
import { fn } from '@vitest/spy'
import { nextTick } from 'vue'

describe('Paper', () => {
  it('should have an input and output area', () => {
    const wrapper = mount(Paper, {
      global: {
        plugins: [router, createTestingPinia({ createSpy: fn })],
        stubs: ['font-awesome-icon']
      }
    })

    expect(wrapper.find('#input-area').exists()).toBeTruthy()
    expect(wrapper.find('#output-area').exists()).toBeTruthy()
  })

  it('should output any user input', async () => {
    const wrapper = mount(Paper, {
      global: {
        plugins: [router, createTestingPinia({ createSpy: fn })],
        stubs: ['font-awesome-icon']
      }
    })

    const input = 'Simple test'

    await wrapper.find('#input-area').setValue(input)

    await nextTick()

    expect(wrapper.find('#output-area').text()).toBe(input)
  })
})

// const markdownTestIn = `\
// # Heading test

// Paragraph test

// ## Another heading!

// Alternate h1!
// =

// Alternate h1 again!
// ===

// Alternate h2!
// ---

// #### Cosmetic closed heading ##

// Test *emphasis* _twice_ and **bold** __twice__ too. Line break test:  
// Now test ***emphasized bold text*** ___twice___. And in*ter*nal emphasis and in**ter**nal bold too!
// \\*Escape it though!\\*

// - How about unordered lists?
// - Check.
// - Double check.

// * All kinds of lists
// * Are available 

// + Believe me
// + I would know

// * Look:
//     > Blockquote inside list
// * Neat, right?
//         Code blocks need 2 indentations!
// * And they also work!

// 1. Ordered lists too?
// 1. Hell yeah.
// 7. Even crazy numbers work.

// 1. You can also:
//     Have more paragraphs inside lists
//     And it will work
// 2. Piece of cake
// 	Works with tabs too
// But you only have to indent the first line

//     And also have distinct paragraphs inside lists!

// 2. This works!

// 1\\. Escape ordered list tag, eh?
// Works like a charm.

// > Test block quotes too.
// >
// > Paragraphs inside block quotes!
// >
// >> Nested block quotes as well!
// >
// > ### Heading inside blockquote!
// >
// > - List inside blockquote, bro
// > - It's everyday
// >
// > 6. Ordered lists too?
// > 10. Yep.

// Let's show \`programmers\` some love.
// Some r\` ea \`l love. (one space after opening backtick and before closing backtick is optional)
// \`escape <html/> babyyy &copy;\`

// \`\`Escaping \`backticks\` in code is easy.\`\`

//     Code blocks!
//     From them, one indentation will be removed.
//         Therefore, this will be more indented.
//     Oh and did I mention <html> tags &copy; should be kept intact too? </html>
//     ## Ah and markdown tags *must* not _be_ processed in here.
//     - ok?
//     - ok.

// \`\`\`this text will be removed
// This alternate code block syntax must be available too.
// Simply because it's undeniably better.
// 1. No _markdown_ tags in here either!
// 1. Right.
// #### Right alright.
// \`\`\`

// Horizontal rules:

// ***

// * *  *

// - -   -

// __ _

// Correctly deal with ampersands! &copy;
// AT&T is a cool thing from star wars.

// Links [work too!](https://www.clubcatusa.com/) Hehe...
// And [they can have titles](https://www.clubcatusa.com/ "This is a title, woah!"), alright!
// And [reference links][id] too!
// And [reference links][Id2] too!
// And [reference links][id3] too!
// And [reference links][id4] too!

// [id]: https://www.clubcatusa.com/ "Another title"
// [id2]: https://www.clubcatusa.com/
//   'Another title'
// [id3]: https://www.clubcatusa.com/ (Another title)
// [iD4]: <https://www.clubcatusa.com/> (Another title)

// Fancy link name as text [Google Ok][]

// Pretty <http://example.com/> auto links!

// [Google ok]: http://google.com/

// \[escape this boy](http://example.com/)

// Images too! Inline: ![Alt text](/path/to/img.jpg)
// With title: ![Alt text](/path/to/img.jpg "Optional title")

// Reference style image: ![Alt text][imageid]

// [imageID]: url/to/image  "Optional title attribute"
// `
