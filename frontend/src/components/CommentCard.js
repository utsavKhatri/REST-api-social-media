import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'
import { Col, Row } from 'react-bootstrap'

const CommentCard = ({post}) => {
  return (
    <Accordion allowToggle>
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        {post.comments.length} Comments...
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>

                  <AccordionPanel pb={4}>
                    {post.comments.map((comment) => (
                      <Box key={comment.id}>
                        <Row>
                          <Text>{comment.text}</Text>
                        </Row>
                        <Row className="text-muted bg-light text-right py-2">
                          <Col xs={3}>
                            <Avatar  size={"xs"} src={comment.user.profilePic} />
                          </Col >
                          <Col>
                            <Text>{comment.user.username}</Text>
                          </Col>
                        </Row>
                      </Box>
                    ))}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
  )
}

export default CommentCard